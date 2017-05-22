<?php

namespace App\Http\Middleware;

use Closure;

class AdminOnly
{
    /**
     * Handle an incoming request.
     * Only allows users who have the is_admin flag.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure                 $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if (!\Auth::user()->is_admin) {
            return response()->error('Not allowed. You must be admin to perform this action.', null, 403);
        }

        return $next($request);
    }
}
