<?php

namespace Database\Seeders;

use App\Chatbot\AiChat;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Alice',
                'email' => 'alice@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Bob',
                'email' => 'bob@example.com',
                'password' => Hash::make('password'),
            ],
            [
                'name' => 'Bototoy',
                'email' => AiChat::AI_USER_EMAIL,
                'password' => Hash::make('ai-bot-no-login-'.config('app.key')),
            ],
        ];

        foreach ($users as $data) {
            User::updateOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => $data['password'],
                ]
            );
        }
    }
}
