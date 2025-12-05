<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="startPage.aspx.cs" Inherits="SEANTextEditor.startPage" %>

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<!-- 
    FILE          : startPage.aspx
    PROJECT       : PROG2001 - Assignment 05 Text Editor
    PROGRAMMERS   : Zemmat Hagos, Najaf Ali
    FIRST VERSION : 2025-12-05
    DESCRIPTION   : 
        Main interface for the Text Editor web application. Provides file selection,
        content editing, and file saving functionality using JavaScript/jQuery
        for client-side operations and ASP.NET for server-side processing.
-->
<head runat="server">
    <title>Text Editor</title>
    <!-- External JavaScript libraries -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="editor.js"></script>
</head>
<body>
    <form runat="server">
        <!-- Application Header -->
        <h1>The Online Text Editor</h1>
        
        <!-- 
            File Selection Section
            Allows users to select existing files from the server
        -->
        <div>
            <b>Select a file:</b>
            <select id="checkFiles">
                <option value="">--- Choose a file ---</option>
                <!-- Options dynamically populated via JavaScript -->
            </select>
            <button type="button" id="btnOpen">Open</button>
        </div>
           
        <br />

        <!-- 
            File Saving Section
            Allows users to save content with a new filename
        -->
        <div>
            <b>Save As:</b>
            <input type="text" id="txtSave" placeholder="newFileName.txt" />
            <button type="button" id="btnSave">Save</button>
        </div>

        <br /><br />

        <!-- 
            Content Editing Area
            Main text area for viewing and editing file contents
        -->
        <div>
            <b>File Contents:</b> <br />
            <textarea id="textContentArea" rows="30" cols="90"></textarea>
        </div>

        <!-- 
            Status Message Display
            Shows operation results (success/error messages)
        -->
        <div id="statusMessage"></div>
    </form>
</body>
</html>