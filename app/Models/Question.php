<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_question'; // Specify the primary key column name
    public $incrementing = true; // Ensure it's an auto-incrementing key
    protected $keyType = 'int'; // The key type is integer

    protected $fillable = ['text', 'type', 'id_sondage'];

    public function options()
    {
        return $this->hasMany(Option::class, 'id_question');
    }

    public function responses()
    {
        return $this->hasMany(Reponse::class, 'id_question');
    }

    public function sondage() {
        return $this->belongsTo(Sondage::class, 'id_sondage');
    }


    // Automatically delete related options when the question is deleted
    protected static function boot()
    {
        parent::boot();
    
        static::deleting(function ($question) {
            if ($question->options) {
                $question->options->each->delete();
            }
    
            if ($question->reponses) {
                $question->reponses->each->delete();
            }
        });
    }
    
    
}
