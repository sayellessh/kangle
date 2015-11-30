package com.megster.cordova;

import java.io.File;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.util.Log;

import android.database.Cursor;
import android.provider.OpenableColumns;

import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONException;
import org.json.JSONObject;

public class FileChooser extends CordovaPlugin {

    private static final String TAG = "FileChooser";
    private static final String ACTION_OPEN = "open";
    private static final int PICK_FILE_REQUEST = 1;
    CallbackContext callback;

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {

        if (action.equals(ACTION_OPEN)) {
            chooseFile(callbackContext);
            return true;
        }

        return false;
    }

    public void chooseFile(CallbackContext callbackContext) {

        // type and title should be configurable

        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.putExtra(Intent.EXTRA_LOCAL_ONLY, true);

        Intent chooser = Intent.createChooser(intent, "Select File");
        cordova.startActivityForResult(this, chooser, PICK_FILE_REQUEST);

        PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
        pluginResult.setKeepCallback(true);
        callback = callbackContext;
        callbackContext.sendPluginResult(pluginResult);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == PICK_FILE_REQUEST && callback != null) {

            if (resultCode == Activity.RESULT_OK) {

                Uri uri = data.getData();

                if (uri != null) {

                    Log.w(TAG, uri.toString());
                    //callback.success(uri.toString());
                    sendSuccessCallback(data);
                } else {

                    callback.error("File uri was null");

                }

            } else if (resultCode == Activity.RESULT_CANCELED) {

                // TODO NO_RESULT or error callback?
                PluginResult pluginResult = new PluginResult(PluginResult.Status.NO_RESULT);
                callback.sendPluginResult(pluginResult);

            } else {

                callback.error(resultCode);
            }
        }
    }
    
    private void sendSuccessCallback(Intent data) {
    	Uri uri = data.getData();
    	String url = uri.toString();
    	try {
        	if(!url.startsWith("file://")) {
        		String fileName = "";
    			/*
    		     * Get the file's content URI from the incoming Intent,
    		     * then query the server app to get the file's display name
    		     * and size.
    		     */
    		    Uri returnUri = data.getData();
    		    Cursor returnCursor = cordova.getActivity().
    		            getContentResolver().query(returnUri, null, null, null, null);
    		    /*
    		     * Get the column indexes of the data in the Cursor,
    		     * move to the first row in the Cursor, get the data,
    		     * and display it.
    		     */
    		    int nameIndex = returnCursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
    		    //int dataIndex = returnCursor.getColumnIndex(MediaStore.MediaColumns.DATA);
    		    returnCursor.moveToFirst();
    		    fileName = returnCursor.getString(nameIndex);
    		    File f = new File(url);
    		    JSONObject jsonObject = new JSONObject();
				jsonObject.put("name", fileName);
				jsonObject.put("path", url);
				jsonObject.put("size", f.length());
        		callback.success(jsonObject.toString());
        	} else {
        		File f = new File(url);
        		JSONObject jsonObject = new JSONObject();
				jsonObject.put("name", f.getName());
				jsonObject.put("path", url);
				jsonObject.put("size", f.length());
            	callback.success(jsonObject.toString());
        	}
    	} catch (JSONException e) {
			// TODO Auto-generated catch block
    		Log.e(this.getClass().getCanonicalName(), e.toString(), e);
    		callback.error(e.toString());
		} catch(Exception e) {
			Log.e(this.getClass().getCanonicalName(), e.toString(), e);
			callback.error(e.toString());
		}
    }
}
