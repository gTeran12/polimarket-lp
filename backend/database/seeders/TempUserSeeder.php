<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TempUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Use firstOrCreate to avoid creating duplicate users if the seeder is run multiple times.
        User::firstOrCreate(
            ['email' => 'jorge@correo.com'],
            [
                'name' => 'jorge',
                'password' => Hash::make('123'),
                'is_admin' => false,
            ]
        );
    }
}
