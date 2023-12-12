//package org.launchcode.recipebook.controllers;
//
//
//import org.launchcode.recipebook.models.Rating;
//import org.launchcode.recipebook.models.data.RecipeRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//@Controller
//@RequestMapping("/recipes")
//public class RecipeController {
//
//    @Autowired
//    private RecipeRepository recipeRepository;
//
//    @GetMapping
//    public String index(Model model) {
//        model.addAttribute("rating", new Rating());
//        return "index";
//    }
//
//    @PostMapping
//    public String save(Rating rating, Model model) {
//        model.addAttribute("rating", rating);
//        return "saved";
//    }
//
//}