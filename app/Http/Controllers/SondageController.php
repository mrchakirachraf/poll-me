<?php
namespace App\Http\Controllers;

use App\Models\Sondage;
use App\Models\Question;
use App\Models\Option;
use Illuminate\Http\Request;

class SondageController extends Controller
{
    public function index()
    {
        return Sondage::with('questions.options')->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|max:10',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|in:choix_unique,choix_multiple',
            'questions.*.options' => 'required|array|min:1',
        ]);

        $sondage = Sondage::create([
            'title' => $request->title,
            'description' => $request->description,
            'id_user' => auth()->id(),
        ]);

        foreach ($request->questions as $questionData) {
            $question = $sondage->questions()->create([
                'text' => $questionData['text'],
                'type' => $questionData['type'],
            ]);

            foreach ($questionData['options'] as $optionText) {
                $question->options()->create(['text' => $optionText]);
            }
        }

        return response()->json($sondage->load('questions.options'), 201);
    }

    public function show($id)
    {
        return Sondage::with('questions.options')->findOrFail($id);
    }

    public function stats()
    {
        $userId = auth()->id();

        $sondages = Sondage::withCount('questions')
            ->where('id_user', $userId)
            ->with(['questions.options'])
            ->get();

        return response()->json($sondages);
    }

}
