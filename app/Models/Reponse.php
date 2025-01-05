<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    use HasFactory;
    protected $fillable = ['id_user','id_question', 'id_option'];

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user');
    }

    public function question()
    {
        return $this->belongsTo(Question::class, 'id_question');
    }

    public function option()
    {
        return $this->belongsTo(Option::class, 'id_option');
    }
}
