<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sondage extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_sondage'; // Specify the primary key column name
    public $incrementing = true; // Ensure it's an auto-incrementing key
    protected $keyType = 'int'; // The key type is integer

    protected $fillable = ['title', 'description', 'id_user'];

    public function questions()
    {
        return $this->hasMany(Question::class, 'id_sondage');
    }

    public function user() {
        return $this->belongsTo(User::class, 'id_user');
    }

    // Automatically delete related questions when the sondage is deleted
    protected static function boot()
    {
        parent::boot();
    
        static::deleting(function ($sondage) {
            if ($sondage->questions) {
                $sondage->questions->each->delete();
            }
        });
    }
    
    
}
