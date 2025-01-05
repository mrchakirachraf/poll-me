<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_option'; // Specify the primary key column name
    public $incrementing = true; // Ensure it's an auto-incrementing key
    protected $keyType = 'int'; // The key type is integer

    protected $fillable = ['text', 'id_question'];

    public function question() {
        return $this->belongsTo(Question::class, 'id_question');
    }
    public function responses()
    {
        return $this->hasMany(Reponse::class, 'id_option');
    }

}
