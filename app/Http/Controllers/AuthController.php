<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // Perform validation and capture errors
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            $errors = $validator->errors();

            $message = '';

            if ($errors->has('name')) {
                if ($errors->first('name') === 'The name field is required.') {
                    $message = 'Name is required.';
                } elseif ($errors->first('name') === 'The name may not be greater than 255 characters.') {
                    $message = 'Name must not exceed 255 characters.';
                }
            } elseif ($errors->has('email')) {
                if ($errors->first('email') === 'The email field is required.') {
                    $message = 'Email is required.';
                } elseif ($errors->first('email') === 'The email has already been taken.') {
                    $message = 'This email is already registered.';
                } elseif ($errors->first('email') === 'The email must be a valid email address.') {
                    $message = 'Please provide a valid email address.';
                }
            } elseif ($errors->has('password')) {
                if ($errors->first('password') === 'The password field is required.') {
                    $message = 'Password is required.';
                } elseif ($errors->first('password') === 'The password must be at least 8 characters.') {
                    $message = 'Password must be at least 8 characters long.';
                }
            }

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 422);
        }


        // Create the user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Return success response
        return response()->json([
            'success' => true,
            'message' => 'User registered successfully.',
            'user' => $user
        ], 200); 
    }

    public function login(Request $request)
    {
        // Validate the input data
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Check if validation fails
        if ($validator->fails()) {
            $errors = $validator->errors();

            $message = '';

            if ($errors->has('email')) {
                if ($errors->first('email') === 'The email field is required.') {
                    $message = 'Please provide your email address.';
                } elseif ($errors->first('email') === 'The email must be a valid email address.') {
                    $message = 'Please provide a valid email address.';
                }
            } elseif ($errors->has('password')) {
                if ($errors->first('password') === 'The password field is required.') {
                    $message = 'Password is required to proceed.';
                }
            }

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 422);
        }



        // Retrieve the user by email
        $user = User::where('email', $request->email)->first();

        // Check if the user exists and the password matches
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials. Please check your email and password.',
            ], 401); // 401 Unauthorized
        }

        // dd($user);


        // Generate a token for the authenticated user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return success response with the token and user data
        return response()->json([
            'success' => true,
            'message' => 'Login successful.',
            'token' => $token,
            'user' => $user
        ], 200); 
    }

    public function logout(Request $request)
    {
        try {
            // Ensure the user is authenticated
            if (!$request->user()) {
                return response()->json(['message' => 'User not authenticated'], 401);
            }
            // Delete all tokens for the user
            $request->user()->tokens()->delete();

            return response()->json(['message' => 'Logged out successfully'], 200);
        } catch (\Exception $e) {
            // Handle any unexpected errors
            return response()->json([
                'message' => 'An error occurred while logging out',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
