<?php

namespace App\Enums;

enum PostStatus: string
{
    case DRAFT = 'draft';
    case SCHEDULED = 'scheduled';
    case PUBLISHING = 'publishing';
    case PUBLISHED = 'published';
    case PARTIALLY_PUBLISHED = 'partially_published';
    case FAILED = 'failed';
    case CANCELLED = 'cancelled';
}
