/*
* FILE          : editor.js
* PROJECT       : PROG2001 - Assignment 05 Text Editor
* PROGRAMMER    : Zemmat Hagos, Najaf Ali
* FIRST VERSION : 2025-12-05
* DESCRIPTION   : 
*      This JavaScript file provides client-side functionality for the Text Editor
*      application. It handles AJAX requests for file operations including loading
*      file lists, opening files, and saving files. The script uses jQuery for
*      DOM manipulation and asynchronous server communication.
*/

// Global variables to maintain state across function calls
var jQueryXMLHttpRequest;  // Stores the current AJAX request object
var selectedFileName;      // Tracks the currently selected filename

//
// FUNCTION      : document.ready Handler
// DESCRIPTION   : Initializes the application when the DOM is fully loaded.
//                 Sets up event handlers and loads initial file list.
// PARAMETERS    : None
// RETURNS       : None
//
$(document).ready(function () {
    // Load the list of available files on startup
    checkFileList();

    // Attach click event handlers to UI buttons
    $("#btnOpen").click(openTheFile);
    $("#btnSave").click(saveTheFile);
});

//
// FUNCTION      : checkFileList
// DESCRIPTION   : Retrieves the list of files from the server-side GetFileList()
//                 method and populates the dropdown menu with available files.
// PARAMETERS    : None
// RETURNS       : void - Updates the UI dropdown with file list or error message
//
function checkFileList() {
    // AJAX request to retrieve file list from server
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "startPage.aspx/GetFileList",
        data: "{}",  // No parameters required for this request
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (checkData) {
            // Ensure response contains valid data
            if (checkData != null && checkData.d != null) {
                var checkResponse = JSON.parse(checkData.d);  // Parse JSON response

                // Check if server operation was successful
                if (checkResponse.status === "Success") {
                    // Clear dropdown and insert default option
                    $("#checkFiles").empty();
                    $("#checkFiles").append('<option value="">-- Choose a file --</option>');

                    var lookFiles = checkResponse.description;  // Array of filenames

                    // Populate dropdown with each filename
                    for (var checkFiles = 0; checkFiles < lookFiles.length; checkFiles++) {
                        $("#checkFiles").append(
                            '<option value="' + lookFiles[checkFiles] + '">' +
                            lookFiles[checkFiles] + '</option>'
                        );
                    }

                    // Update status message
                    document.getElementById("statusMessage").innerHTML = "File list loaded";
                }
            }
        },

        //
        // FUNCTION      : AJAX Fail Handler
        // DESCRIPTION   : Handles failed AJAX requests for file list retrieval
        // PARAMETERS    : None
        // RETURNS       : None - Updates UI with error message
        //
        fail: function () {
            document.getElementById("statusMessage").innerHTML = "The call to the Web failed!";
        }
    });
}

//
// FUNCTION      : openTheFile
// DESCRIPTION   : Opens the selected file by sending the filename to the server-side
//                 GetFileContents() method and displays the contents in the text area.
// PARAMETERS    : None
// RETURNS       : void - Updates text area with file contents or displays error
//
function openTheFile() {
    // Get selected file from dropdown
    selectedFileName = $("#checkFiles").val();

    // Validate that a file was selected
    if (!selectedFileName) {
        document.getElementById("statusMessage").innerHTML = "Select a file!!";
        return;
    }

    // Create JSON object with filename for server request
    var jsonData = { fileName: selectedFileName };
    var jsonString = JSON.stringify(jsonData);

    // AJAX request to retrieve file contents
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "startPage.aspx/GetFileContents",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (fileData) {
            // Ensure response contains valid data
            if (fileData != null && fileData.d != null) {
                var checkResponse = JSON.parse(fileData.d);

                // Display file content in text area
                document.getElementById("textContentArea").value = checkResponse.contents;

                // Update status message
                document.getElementById("statusMessage").innerHTML = "File is opened";
            }
        },

        //
        // FUNCTION      : AJAX Fail Handler
        // DESCRIPTION   : Handles failed AJAX requests for file opening
        // PARAMETERS    : None
        // RETURNS       : None - Updates UI with error message
        //
        fail: function () {
            document.getElementById("statusMessage").innerHTML = "The call to the Web failed!";
        }
    });
}

//
// FUNCTION      : saveTheFile
// DESCRIPTION   : Saves text from the editor to a file on the server. If a new
//                 filename is provided, creates a new file; otherwise overwrites
//                 the currently selected file.
// PARAMETERS    : None
// RETURNS       : void - Updates status message and refreshes file list if needed
//
function saveTheFile() {
    // Get text content from editor
    var fileStuff = document.getElementById("textContentArea").value;

    // Get new filename from input field (if provided)
    var newFile = document.getElementById("txtSave").value.trim();

    // Determine final filename (new name or existing selected name)
    var finalName = (newFile !== "") ? newFile : selectedFileName;

    // Validate that a filename exists
    if (!finalName) {
        document.getElementById("statusMessage").innerHTML = "Please select a file";
        return;
    }

    // Package filename and content in JSON format for server
    var jsonData = {
        fileName: finalName,
        getContents: fileStuff
    };
    var jsonString = JSON.stringify(jsonData);

    // AJAX request to save file to server
    jQueryXMLHttpRequest = $.ajax({
        type: "POST",
        url: "startPage.aspx/SaveTheFile",
        data: jsonString,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (checkData) {
            if (checkData != null && checkData.d != null) {
                var checkResponse = JSON.parse(checkData.d);

                // Display server response message
                document.getElementById("statusMessage").innerHTML = checkResponse.description;

                // If saving as a new file, refresh the dropdown list
                if (newFile !== "") {
                    selectedFileName = finalName;  // Update selected file reference
                    document.getElementById("txtSave").value = "";  // Clear new filename input
                    checkFileList();  // Refresh file list
                }
            }
        },

        //
        // FUNCTION      : AJAX Fail Handler
        // DESCRIPTION   : Handles failed AJAX requests for file saving
        // PARAMETERS    : None
        // RETURNS       : None - Updates UI with error message
        //
        fail: function () {
            document.getElementById("statusMessage").innerHTML = "ERROR Saving File failed!";
        }
    });
}