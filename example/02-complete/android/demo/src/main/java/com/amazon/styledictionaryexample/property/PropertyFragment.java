package com.amazon.styledictionaryexample.property;

import android.app.Fragment;
import android.content.Context;
import android.os.Bundle;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.StyleDictionaryNode;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;

/**
 * A fragment representing a list of Items.
 * <p/>
 * Activities containing this fragment MUST implement the {@link OnListFragmentInteractionListener}
 * interface.
 */
public class PropertyFragment extends Fragment {

    private static final String TAG = PropertyFragment.class.getSimpleName();

    private OnListFragmentInteractionListener mListener;
    private ArrayList<StyleDictionaryNode> nodeList;

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public PropertyFragment() {
        nodeList = StyleDictionaryHelper.getNodeArrayForObject(StyleDictionaryHelper.DICTIONARY_JSON);
    }

    public static PropertyFragment newInstance(ArrayList<StyleDictionaryNode> nodeList) {
        PropertyFragment fragment = new PropertyFragment();
        fragment.nodeList = nodeList;
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_property_list, container, false);

        // Set the adapter
        if (view instanceof RecyclerView) {
            RecyclerView recyclerView = (RecyclerView) view;
            recyclerView.setAdapter(new PropertyRecyclerViewAdapter(nodeList, mListener));
        }
        return view;
    }


    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        if (context instanceof OnListFragmentInteractionListener) {
            mListener = (OnListFragmentInteractionListener) context;
        } else {
            throw new RuntimeException(context.toString()
                    + " must implement OnListFragmentInteractionListener");
        }
    }

    @Override
    public void onDetach() {
        super.onDetach();
        mListener = null;
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p/>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnListFragmentInteractionListener {
        void onListFragmentInteraction(StyleDictionaryNode item);
    }
}
