<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        $addCreatedAt = !Schema::hasColumn('users', 'created_at');
        $addUpdatedAt = !Schema::hasColumn('users', 'updated_at');
        $addIsAdmin = !Schema::hasColumn('users', 'is_admin');

        if ($addCreatedAt || $addUpdatedAt || $addIsAdmin) {
            Schema::table('users', function (Blueprint $table) use ($addCreatedAt, $addUpdatedAt, $addIsAdmin) {
                if ($addCreatedAt) {
                    $table->timestamp('created_at')->nullable();
                }
                if ($addUpdatedAt) {
                    $table->timestamp('updated_at')->nullable();
                }
                if ($addIsAdmin) {
                    $table->boolean('is_admin')->default(false);
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (!Schema::hasTable('users')) {
            return;
        }

        $dropCreatedAt = Schema::hasColumn('users', 'created_at');
        $dropUpdatedAt = Schema::hasColumn('users', 'updated_at');
        $dropIsAdmin = Schema::hasColumn('users', 'is_admin');

        if ($dropCreatedAt || $dropUpdatedAt || $dropIsAdmin) {
            Schema::table('users', function (Blueprint $table) use ($dropCreatedAt, $dropUpdatedAt, $dropIsAdmin) {
                $columns = [];
                if ($dropCreatedAt) {
                    $columns[] = 'created_at';
                }
                if ($dropUpdatedAt) {
                    $columns[] = 'updated_at';
                }
                if ($dropIsAdmin) {
                    $columns[] = 'is_admin';
                }
                if ($columns) {
                    $table->dropColumn($columns);
                }
            });
        }
    }
};
