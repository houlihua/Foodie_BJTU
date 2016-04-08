package com.example.FoodieAndroidApp.widge;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;
import com.example.FoodieAndroidApp.R;
import com.example.FoodieAndroidApp.model.Friend;

import java.util.List;

/**
 * Created by zhao on 2016/3/10.
 */
public class FriendAdapter extends ArrayAdapter<Friend>{

    private int resourceId;
    public FriendAdapter(Context context, int itemViewResourceId, List<Friend> object){
        super(context,itemViewResourceId,object);
        resourceId = itemViewResourceId;
    }
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Friend friend = getItem(position);

        View view;
        ViewHolder viewHolder;

        if(convertView == null){
            view = LayoutInflater.from(getContext()).inflate(resourceId,null);
            viewHolder = new ViewHolder();
            viewHolder.headPortrait = (ImageView) view.findViewById(R.id.friend_head_portrait);
            viewHolder.name = (TextView)view.findViewById(R.id.friend_name);
            view.setTag(viewHolder);
        }else {
            view = convertView;
            viewHolder = (ViewHolder) view.getTag();
        }
        viewHolder.headPortrait.setImageResource(friend.getHeadPortrait());
        viewHolder.name.setText(friend.getName());

        return view;
    }

    public class ViewHolder {
        ImageView headPortrait;
        TextView name;
    }
}
