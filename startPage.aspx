<%-- 
    COMMENT FILE            : StartName.aspx
    COMMENT PROJECT         : PROG2001 - Assignment 05 Text Editor
    COMMENT PROGRAMMER      : Zemmat Hagos, Najaf Ali
    COMMENT FIRST VERSION   : 2025-12-05
    COMMENT DESCRIPTION     :
        This will serves as the user interface for the Text Editor 
        application.
--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="startPage.aspx.cs" Inherits="SEANTextEditor.startPage" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Text Editor</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type ="text/javascript" src="editor.js"></script>
</head>
<body>
    
    <form runat="server">
        <h1>the online Text Editor</h1>
        <div>
            <b>Select a file:</b>
            <select id="checkFiles">
                <option value="">--- Choose a file --</option>
            </select>
            <button type ="button" id= "btnOpen"> Open</button>
            </div>
           
          <br />


           <div>
               <b>Save As:</b>
               <input type="text" id="txtSave" placeholder="new fileName.txt" />
               <button type="button" id="btnSave">Save</button>


            <br /><br />

        </div>

        <br />

        <div>
            <b>File Contents:</b> <br />
            <textarea id="textContentArea" rows="30" cols="90"></textarea>
        </div>

        <div id="statusMessage"></div>
        </form>
</body>
</html>
