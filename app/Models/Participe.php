<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Participe extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_user',
        'id_sondage',
    ];
}
