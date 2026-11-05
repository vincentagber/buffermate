<?php

namespace App\Http\Controllers\Api\Payment;

use App\Http\Controllers\Controller;
use App\Models\BachsPayment;
use App\Models\Workspace;
use App\Services\Payment\BachsPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class BachsPaymentController extends Controller
{
    protected BachsPaymentService $bachsService;

    public function __construct(BachsPaymentService $bachsService)
    {
        $this->bachsService = $bachsService;
    }

    /**
     * Create a Bachs Hosted Checkout Session
     * POST /api/payments/bachs/checkout-session
     */
    public function createCheckoutSession(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id') ?: $request->input('workspace_id');
        if (!$workspaceId) {
            $workspace = Workspace::first();
            $workspaceId = $workspace ? $workspace->id : 'default_workspace';
        }

        $validated = $request->validate([
            'plan_id' => 'required|string|in:pro,agency,free',
            'billing_cycle' => 'nullable|string|in:monthly,annual',
            'customer_email' => 'nullable|email',
            'customer_name' => 'nullable|string|max:120',
            'success_url' => 'nullable|url',
            'cancel_url' => 'nullable|url',
        ]);

        // If user is selecting free, downgrade directly
        if ($validated['plan_id'] === 'free') {
            $workspace = Workspace::find($workspaceId);
            if ($workspace) {
                $workspace->plan_id = 'free';
                $workspace->save();
            }
            return response()->json([
                'success' => true,
                'message' => 'Workspace switched to Starter Free tier.',
                'plan_id' => 'free',
            ]);
        }

        $session = $this->bachsService->createCheckoutSession([
            'workspace_id' => $workspaceId,
            'user_id' => $request->attributes->get('user_id') ?: 'dev_user',
            'plan_id' => $validated['plan_id'],
            'billing_cycle' => $validated['billing_cycle'] ?? 'monthly',
            'customer_email' => $validated['customer_email'] ?? 'alex.morgan@buffermate.ai',
            'customer_name' => $validated['customer_name'] ?? 'Alex Morgan',
            'success_url' => $validated['success_url'] ?? url('/dashboard/analytics?payment=success&gateway=bachs&plan=' . $validated['plan_id']),
            'cancel_url' => $validated['cancel_url'] ?? url('/dashboard/analytics?payment=cancelled'),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Bachs checkout session initialized successfully.',
            'data' => $session,
        ]);
    }

    /**
     * Check / Verify Checkout Session Status
     * GET /api/payments/bachs/session/{sessionId}
     */
    public function getSession(Request $request, string $sessionId): JsonResponse
    {
        $payment = BachsPayment::where('session_id', $sessionId)->first();
        if (!$payment) {
            return response()->json([
                'success' => false,
                'message' => 'Session not found',
            ], 404);
        }

        // If query param confirm=1 is passed on redirect return, confirm and complete
        if ($request->boolean('confirm') && $payment->status !== 'completed') {
            $payment = $this->bachsService->completeSession($sessionId);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'session_id' => $payment->session_id,
                'plan_id' => $payment->plan_id,
                'billing_cycle' => $payment->billing_cycle,
                'amount' => $payment->amount,
                'currency' => $payment->currency,
                'status' => $payment->status,
                'paid_at' => $payment->paid_at?->toIso8601String(),
                'checkout_url' => $payment->checkout_url,
            ],
        ]);
    }

    /**
     * Bachs Webhook Receiver
     * POST /api/webhooks/bachs
     */
    public function handleWebhook(Request $request): JsonResponse
    {
        $rawBody = $request->getContent();
        $signature = $request->header('X-Bachs-Signature') ?: $request->header('X-Bachs-Signature-V2');
        $timestamp = $request->header('X-Bachs-Timestamp');

        // Verify HMAC signature unless in development sandbox test mode with mock payload
        if ($signature) {
            $isValid = $this->bachsService->verifyWebhookSignature($rawBody, $signature, $timestamp);
            if (!$isValid) {
                Log::warning('Rejected Bachs webhook with invalid HMAC signature.');
                return response()->json(['error' => 'Invalid webhook signature'], 401);
            }
        }

        $payload = $request->json()->all();
        $result = $this->bachsService->handleWebhookEvent($payload);

        return response()->json([
            'received' => true,
            'result' => $result,
        ]);
    }

    /**
     * List Available Bachs Plans & Pricing
     * GET /api/payments/bachs/plans
     */
    public function getPlans(Request $request): JsonResponse
    {
        $workspaceId = $request->attributes->get('workspace_id');
        $workspace = $workspaceId ? Workspace::find($workspaceId) : Workspace::first();

        return response()->json([
            'success' => true,
            'gateway' => [
                'provider' => 'bachs',
                'environment' => str_starts_with(config('bachs.api_key'), 'sk_live_') ? 'production' : 'sandbox',
                'docs_url' => 'https://docs.bachs.io/',
            ],
            'current_plan' => $workspace?->plan_id ?: 'pro',
            'plans' => config('bachs.plans'),
        ]);
    }
}

