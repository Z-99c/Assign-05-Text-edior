
// COMMENT FILE            : editor.js
// COMMENT PROJECT         : PROG2001 - Assignment 05 Text Editor
// COMMENT PROGRAMMER      : Zemmat Hagos, Najaf Ali
// COMMENT FIRST VERSION   : 2025-12-05
// COMMENT DESCRIPTION     :
// COMMENT   This page handles the client-side JavaScript for the
// COMMENT   Text Editor application through ajax requests

// global variables
var jQueryXMLHttpRequest; // this will hold the AJAX request information
var selectedFileName; // and this will store the selected file name


// COMMENT FUNCTION     : Document Ready Handler
// COMMENT DESCRIPTION  :
// COMMENT   when the webpage has fully loaded. It initializes the
// COMMENT   dropdown list of files

$(document).ready(function () {
    checkFileList(); // this will load the available file list

    // this will be the click handlers
    $("#btnOpen").click(openTheFile);
    $("#btnSave").click(saveTheFile);
});

// COMMENT FUNCTION: checkFileList
// COMMENT DESCRIPTION:
// Calls the server-side GetFileList() to retrieve a list
// of all files stored in the MyFiles directory.
// COMMENT PARAMETERS:
// None
// COMMENT RETURNS      :
// void : Updates the UI with a file list or an error message.
function checkFileList()
{
    // AJAX request to read the file
    jQueryXMLHttpRequest = $.ajax({

        type: "POST",
        url: "startPage.aspx/GetFileList",
        data: "{}", // no paramters required
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (checkData) {

            // Ensure response contains data
            if (checkData != null && checkData.d != null)
            {
                var checkResponse = JSON.parse(checkData.d); // this will Parse JSON string returned from the server side

                //used if statement to check if the server is sucessfull
                if (checkResponse.status === "Success")
                {   
                    // this will clear dropdown and insert default option
                    $("#checkFiles").empty();
                    $("#checkFiles").append('<option value="">-- Choose a file --</option>');

                    var lookFiles = checkResponse.description; // store list of the filenames

                    // loop to find the dropdown with filenames
                    for (var checkFiles = 0; checkFiles < lookFiles.length; checkFiles++)
                    {
                        $("#checkFiles").append('<option value="' + lookFiles[checkFiles] + '">' + lookFiles[checkFiles] + '</option>');
                    }

                    document.getElementById("statusMessage").innerHTML = "File list loaded"; // update the message
                }

            }
        },

        //this will call a fail functions
        fail: function () {
            document.getElementById("statusMessage").innerHTML = "The call to the Web failed!";
        }

         
    });
    

}

// COMMENT FUNCTION: openTheFile
// COMMENT DESCRIPTION  :
// Sends the selected filename to the GetFileContents to retrieve a list
// of all files stored in the MyFiles directory.
// COMMENT PARAMETERS:
// None
// COMMENT RETURNS:
// void : 
function openTheFile() {

    // Get selected file from dropdown
    selectedFileName = $("#checkFiles").val();

    // This will ensure a file was selected
    if (!selectedFileName)
    {
        document.getElementById("statusMessage").innerHTML = "Select a file!!";
        return;
    }

    // Create JSON object to send to server
    var jsonData = { fileName: selectedFileName };
    var jsonString = JSON.stringify(jsonData);

    // AJAX request to read the file
    jQueryXMLHttpRequest = $.ajax({

        type: "POST",
        url: "startPage.aspx/GetFileContents",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        //
        success: function (fileData)
        {
            // Ensure response contains data
            if (fileData != null && fileData.d != null)
            {

                var checkResponse = JSON.parse(fileData.d);

                document.getElementById("textContentArea").value = checkResponse.contents; // Display file content in text area

                document.getElementById("statusMessage").innerHTML = "File is opened";
            }
        },

        // once again check if it will fail
        fail: function ()
        {
            document.getElementById("statusMessage").innerHTML = "The call to the Web failed!";
        }


    
    });
}

// COMMENT FUNCTION     : saveTheFile
// COMMENT DESCRIPTION  :
// COMMENT   Saves text from the editor back into a file on the server.
// COMMENT  
// COMMENT PARAMETERS   : None
// COMMENT RETURNS      : void : 
function saveTheFile()
{

    var fileStuff = document.getElementById("textContentArea").value; // get the text file from the editor

    var newFile = document.getElementById("txtSave").value.trim(); // check if the user typed a new filename

    var finalName = (newFile !== "") ? newFile : selectedFileName; // decide final filename if it exists

    //Ensure a filename exists
    if (!finalName)
    {
        document.getElementById("statusMessage").innerHTML = "Please select a file";

        return;
    }

    // Package filename + content in JSON format
    var jsonData = { fileName: finalName, getContents: fileStuff }; 
    var jsonString = JSON.stringify(jsonData);

    // then use AJAX request to save a file
    jQueryXMLHttpRequest = $.ajax({

        type: "POST",
        url: "startPage.aspx/SaveTheFile",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",

        success: function (checkData)
        {
            if (checkData != null && checkData.d != null) {

                var checkResponse = JSON.parse(checkData.d);

                document.getElementById("statusMessage").innerHTML = checkResponse.description; // Display message from server

                // if there is a new file this will refresh the dropdown
                if (newFile !== "")
                {
                    selectedFileName = finalName;
                    document.getElementById("txtSave").value = "";
                    checkFileList();
                }
            }
        },

        fail: function ()
        {
            document.getElementById("statusMessage").innerHTML = "ERROR Saving File failed!";
        }

    });
}
