package com.example.FoodieAndroidApp.model;

/**
 * Created by zhao on 2016/3/10.
 */
public class Friend {

    public Friend(String name, int headPortrait) {
        this.name = name;
        this.headPortrait = headPortrait;
    }

    private String name;
    private int headPortrait;

    public String getName() {
        return name;
    }

    public int getHeadPortrait() {
        return headPortrait;
    }

}
