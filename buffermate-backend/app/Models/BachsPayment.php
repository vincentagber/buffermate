<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BachsPayment extends Model
{
    use HasUuids;

    protected $table = 'bachs_payments';

    protected $fillable = [
        'id',
        'workspace_id',
        'user_id',
        'session_id',
        'checkout_url',
        'customer_email',
        'customer_name',
        'plan_id',
        'billing_cycle',
        'amount',
        'currency',
        'status',
        'subscription_id',
        'product_id',
        'metadata',
        'raw_payload',
        'paid_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'raw_payload' => 'array',
        'paid_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function workspace(): BelongsTo
    {
        return $this->belongsTo(Workspace::class, 'workspace_id');
    }
}
