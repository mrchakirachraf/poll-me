<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sondage extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'description', 'id_user'];

    public function questions()
    {
        return $this->hasMany(Question::class, 'id_sondage');
    }

    public function user() {
        return $this->belongsTo(User::class, 'id_user');
    }
    
}
