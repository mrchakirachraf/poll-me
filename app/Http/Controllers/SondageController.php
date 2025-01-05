<?php
namespace App\Http\Controllers;

use App\Models\Sondage;
use App\Models\Question;
use App\Models\Option;
use App\Models\Reponse;
use App\Models\User;
use Illuminate\Http\Request;

use App\Models\Participe;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class SondageController extends Controller
{
    public function index()
    {
        return Sondage::orderBy('created_at', 'desc')->get();
    }

    
    
    public function show($id)
    {
        $userId = auth()->id(); // Get the currently authenticated user ID
    
        // Check if the user has already participated in this poll
        $hasParticipated = Participe::where('id_user', $userId)
            ->where('id_sondage', $id)
            ->exists();
    
        if ($hasParticipated) {
            return response()->json([
                'message' => 'You have already participated in this poll.',
            ], 403); // 403 Forbidden status code
        }
    
        // Fetch the poll with its questions and options
        $sondage = Sondage::with('questions.options')->findOrFail($id);
    
        return response()->json($sondage, 200);
    }
    
    public function createSondage(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'questions' => 'required|array|max:10',
                'questions.*.text' => 'required|string',
                'questions.*.type' => 'required|in:choix_unique,choix_multiple',
                'questions.*.options' => 'required|array|min:1',
                'questions.*.options.*' => 'required|string',
            ]);

            // Create the survey
            $sondage = Sondage::create([
                'title' => $request->title,
                'description' => $request->description,
                'id_user' => auth()->id(),
            ]);

            foreach ($request->questions as $questionData) {
                // Create each question
                $question = $sondage->questions()->create([
                    'text' => $questionData['text'],
                    'type' => $questionData['type'],
                ]);

                foreach ($questionData['options'] as $optionText) {
                    // Create each option for the question
                    $question->options()->create(['text' => $optionText]);
                }
            }

            return response()->json([
                'message' => 'Survey created successfully!',
                'sondage' => $sondage->load('questions.options'),
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            // Handle unexpected errors
            return response()->json([
                'message' => 'An error occurred while creating the survey.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function saveResponses(Request $request, $id_sondage)
    {
        try {
            $request->validate([
                'responses' => 'required|array',
                'responses.*.id_question' => 'required|exists:questions,id_question',
                'responses.*.id_option' => 'required|exists:options,id_option',
            ]);

            $sondage = Sondage::with('questions')->findOrFail($id_sondage);

            foreach ($request->responses as $response) {
                $question = $sondage->questions->where('id_question', $response['id_question'])->first();
                if (!$question) {
                    return response()->json([
                        'message' => 'The question does not belong to this survey.',
                    ], 400);
                }

                Reponse::create([
                    'id_user' => auth()->id(),
                    'id_question' => $response['id_question'],
                    'id_option' => $response['id_option'],
                ]);
            }

            return response()->json(['message' => 'Responses saved successfully!'], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while saving the responses.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function saveParticipation(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'id_sondage' => 'required|exists:sondages,id_sondage',
            ]);
    
            $userId = auth()->id(); // Get the authenticated user's ID
            $sondageId = $request->input('id_sondage');
    
            // Save participation (avoiding duplicates)
            $participation = Participe::firstOrCreate([
                'id_user' => $userId,
                'id_sondage' => $sondageId,
            ]);
    
            return response()->json([
                'message' => 'Participation saved successfully',
                'participation' => $participation,
            ], 200);
    
        } catch (ValidationException $e) {
            // Handle validation errors
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
    
        } catch (QueryException $e) {
            // Handle database-related errors
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage(),
            ], 500);
    
        } catch (\Exception $e) {
            // Handle any other exceptions
            return response()->json([
                'message' => 'An unexpected error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function handleParticipation(Request $request,$id_sondage)
    {
        try {
            $this->saveParticipation($request);
    
            if ($request->has('responses')) {
                $this->saveResponses($request,$id_sondage);
            }
    
            return response()->json([
                'message' => 'Participation and responses saved successfully',
            ], 200);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
    
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'Database error',
                'error' => $e->getMessage(),
            ], 500);
    
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An unexpected error occurred',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function deleteSondage($id_sondage)
    {
        try {
            $sondage = Sondage::where('id_sondage', $id_sondage)
                ->where('id_user', auth()->id())
                ->firstOrFail();

            $sondage->delete();

            return response()->json(['message' => 'Survey deleted successfully!'], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Survey not found or you do not have permission to delete it.',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while deleting the survey.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateSondage(Request $request, $id)
    {
        // Valider les données entrantes
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|max:10',
            'questions.*.id_question' => 'nullable|exists:questions,id_question',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|in:choix_unique,choix_multiple',
            'questions.*.options' => 'required|array|min:1',
        ]);

        // Trouver le sondage
        $sondage = Sondage::findOrFail($id);

        // Vérifier si l'utilisateur est le propriétaire
        if ($sondage->id_user !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Mettre à jour les informations de base du sondage
        $sondage->update([
            'title' => $request->title,
            'description' => $request->description,
        ]);

        // Gestion des questions
        $existingQuestionIds = $sondage->questions->pluck('id_question')->toArray();
        $submittedQuestionIds = array_column($request->questions, 'id_question');

        // Supprimer les questions qui ne sont plus soumises
        foreach ($existingQuestionIds as $existingId) {
            if (!in_array($existingId, $submittedQuestionIds)) {
                $question = Question::find($existingId);
                if ($question) {
                    $question->delete();
                }
            }
        }

        // Ajouter ou mettre à jour les questions soumises
        foreach ($request->questions as $questionData) {
            if (isset($questionData['id_question']) && $questionData['id_question']) {
                // Mettre à jour une question existante
                $question = Question::find($questionData['id_question']);
                if ($question) {
                    $question->update([
                        'text' => $questionData['text'],
                        'type' => $questionData['type'],
                    ]);

                    // Gérer les options de la question
                    $existingOptions = $question->options->pluck('text')->toArray();
                    $submittedOptions = $questionData['options'];

                    // Supprimer les options qui ne sont plus soumises
                    foreach ($existingOptions as $existingOption) {
                        if (!in_array($existingOption, $submittedOptions)) {
                            Option::where('id_question', $question->id_question)
                                ->where('text', $existingOption)
                                ->delete();
                        }
                    }

                    // Ajouter les nouvelles options
                    foreach ($submittedOptions as $optionText) {
                        if (!in_array($optionText, $existingOptions)) {
                            $question->options()->create(['text' => $optionText]);
                        }
                    }
                }
            } else {
                // Ajouter une nouvelle question
                $newQuestion = $sondage->questions()->create([
                    'text' => $questionData['text'],
                    'type' => $questionData['type'],
                ]);

                // Ajouter les options pour la nouvelle question
                foreach ($questionData['options'] as $optionText) {
                    $newQuestion->options()->create(['text' => $optionText]);
                }
            }
        }

        // Retourner le sondage mis à jour avec ses relations
        return response()->json($sondage->load('questions.options'), 200);
    }


    public function getSondagesByUser($id_user)
    {
        // Vérifiez si l'utilisateur existe
        $user = User::find($id_user);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur introuvable'], 404);
        }

        // Récupérez les sondages de l'utilisateur avec leurs questions et options
        $sondages = Sondage::where('id_user', $id_user)
            ->orderBy('created_at', 'desc') // Trier par date de création (le plus récent en premier)
            ->get();

        return response()->json($sondages, 200);
    }

    public function getSondageStatistics($id_sondage)
    {
        // Récupérez le sondage avec ses questions et options
        $sondage = Sondage::with('questions.options')->find($id_sondage);
    
        if (!$sondage) {
            return response()->json(['message' => 'Sondage introuvable'], 404);
        }

        // Check if the authenticated user is the creator of the poll
        if ($sondage->id_user !== auth()->id()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $statistics = [];
    
        foreach ($sondage->questions as $question) {
            $totalResponses = Reponse::where('id_question', $question->id_question)->count();
    
            $optionsStats = [];
            foreach ($question->options as $option) {
                $optionResponses = Reponse::where('id_question', $question->id_question)
                    ->where('id_option', $option->id_option)
                    ->count();
    
                $percentage = $totalResponses > 0 
                    ? round(($optionResponses / $totalResponses) * 100, 2) 
                    : 0;
    
                $optionsStats[] = [
                    'option_text' => $option->text,
                    'response_count' => $optionResponses,
                    'percentage' => $percentage
                ];
            }
    
            $statistics[] = [
                'question_text' => $question->text,
                'total_responses' => $totalResponses,
                'options' => $optionsStats
            ];
        }
    
        return response()->json([
            'sondage' => $sondage->title,
            'statistics' => $statistics
        ], 200);
    }
    
}
