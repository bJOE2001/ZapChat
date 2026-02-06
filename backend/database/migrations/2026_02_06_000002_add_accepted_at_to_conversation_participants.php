<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('conversation_participants', function (Blueprint $table) {
            $table->timestamp('accepted_at')->nullable()->after('last_read_at');
        });

        // Existing participants are treated as already accepted
        \DB::table('conversation_participants')->update(['accepted_at' => now()]);
    }

    public function down(): void
    {
        Schema::table('conversation_participants', function (Blueprint $table) {
            $table->dropColumn('accepted_at');
        });
    }
};
