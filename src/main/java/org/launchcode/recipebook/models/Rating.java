package org.launchcode.recipebook.models;

import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

@Entity
public class Rating extends AbstractEntity{

    @ManyToOne
    private User user;

    private Recipe recipe;

    private double averageRating;
    private int totalVotes;

    public Rating(User user, Recipe recipe, double averageRating, int totalVotes) {
        this.user = user;
        this.recipe = recipe;
        this.averageRating = averageRating;
        this.totalVotes = totalVotes;
    }

    public Rating () {}

    
}
