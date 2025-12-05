/*
 * FILE          : StartName.aspx.cs
 * PROJECT       : PROG2001 - Assignment 05 Text Editor
 * PROGRAMMER    : Zemmat Hagos, Najaf Ali
 * FIRST VERSION : 2025-12-05
 * DESCRIPTION   : 
 *      This code-behind file provides server-side WebMethods for the Text Editor
 *      application. It handles file operations including listing files in the
 *      MyFiles directory, reading file contents, and saving file changes. All
 *      methods use JSON serialization for client-server communication.
 */

using System;
using System.Collections.Generic;
using System.IO;
using System.Web;
using System.Web.Services;
using Newtonsoft.Json;

namespace SEANTextEditor
{
    public partial class startPage : System.Web.UI.Page
    {
        //
        // METHOD      : Page_Load
        // DESCRIPTION : Standard Page_Load event handler (currently unused)
        // PARAMETERS  :
        //      object sender    : The source of the event
        //      EventArgs e      : An object that contains no event data
        // RETURNS     : None
        //
        protected void Page_Load(object sender, EventArgs e)
        {
            // Page load event handler - left empty as no initialization required
        }

        //
        // METHOD      : GetFileList
        // DESCRIPTION : WebMethod that retrieves a list of all files in the MyFiles
        //               directory and returns them as JSON for client-side display
        // PARAMETERS  : None
        // RETURNS     : string - JSON formatted response with status and file list
        //
        [WebMethod]
        public static string GetFileList()
        {
            string returnTheData;  // JSON string to return to client
            string fileStatus;     // Operation status (Success/Failure/Exception)
            string fileContents;   // Description or file contents

            try
            {
                // Get physical path to MyFiles directory
                string folderPath = HttpContext.Current.Server.MapPath("~/MyFiles");

                // Check if directory exists
                if (Directory.Exists(folderPath))
                {
                    // Get all file paths in directory
                    string[] checkFile = Directory.GetFiles(folderPath);

                    // Create list to store only filenames (without path)
                    List<string> fileNames = new List<string>();

                    // Extract filename from each full path
                    foreach (string file in checkFile)
                    {
                        fileNames.Add(Path.GetFileName(file));
                    }

                    fileStatus = "Success";  // Operation successful

                    // Serialize response to JSON format
                    returnTheData = JsonConvert.SerializeObject(new
                    {
                        status = fileStatus,
                        description = fileNames
                    });

                    return returnTheData;
                }
                else
                {
                    // Directory not found
                    fileStatus = "Failure";
                    fileContents = "The directory doesn't exist";
                }
            }
            catch (Exception ex)
            {
                // Handle unexpected exceptions
                fileStatus = "Exception";
                fileContents = "ERROR: " + ex.ToString();
            }

            // Return error response
            returnTheData = JsonConvert.SerializeObject(new
            {
                status = fileStatus,
                description = fileContents
            });

            return returnTheData;
        }

        //
        // METHOD      : GetFileContents
        // DESCRIPTION : WebMethod that reads the contents of a specified file
        //               from the MyFiles directory and returns it as JSON
        // PARAMETERS  :
        //      string fileName  : Name of the file to read
        // RETURNS     : string  - JSON formatted response with status and file contents
        //
        [WebMethod]
        public static string GetFileContents(string fileName)
        {
            string returnTheData;  // JSON string to return to client
            string fileStatus;     // Operation status (Success/Failure/Exception)
            string fileContents;   // File contents or error description

            try
            {
                // Get physical path to MyFiles directory
                string folderPath = HttpContext.Current.Server.MapPath("~/MyFiles");

                // Build complete file path
                string filePath = Path.Combine(folderPath, fileName);

                // Check if file exists before reading
                if (File.Exists(filePath))
                {
                    // Read entire file contents
                    fileContents = File.ReadAllText(filePath);
                    fileStatus = "Success";  // Operation successful

                    // Serialize response to JSON format
                    returnTheData = JsonConvert.SerializeObject(new
                    {
                        status = fileStatus,
                        contents = fileContents
                    });

                    return returnTheData;
                }
                else
                {
                    // File not found
                    fileStatus = "Failure";
                    fileContents = "File doesn't exist";
                }
            }
            catch (Exception ex)
            {
                // Handle unexpected exceptions
                fileStatus = "Exception";
                fileContents = "ERROR: " + ex.ToString();
            }

            // Return error response
            returnTheData = JsonConvert.SerializeObject(new
            {
                status = fileStatus,
                description = fileContents
            });

            return returnTheData;
        }

        //
        // METHOD      : SaveTheFile
        // DESCRIPTION : WebMethod that saves content to a file in the MyFiles
        //               directory. Creates new file if it doesn't exist, 
        //               overwrites if it does.
        // PARAMETERS  :
        //      string fileName    : Name of the file to save
        //      string getContents : Content to write to the file
        // RETURNS     : string    - JSON formatted response with status message
        //
        [WebMethod]
        public static string SaveTheFile(string fileName, string getContents)
        {
            string returnTheData;  // JSON string to return to client
            string fileStatus;     // Operation status (Success/Exception)
            string fileContents;   // Success/error message
            string filePath;       // Complete path to file
            string folderPath;     // Path to MyFiles directory

            try
            {
                // Get physical path to MyFiles directory
                folderPath = HttpContext.Current.Server.MapPath("~/MyFiles");

                // Build complete file path
                filePath = Path.Combine(folderPath, fileName);

                // Write all text content to file (creates new or overwrites existing)
                File.WriteAllText(filePath, getContents);

                fileStatus = "Success";  // Operation successful
                fileContents = "File saved successfully";
            }
            catch (Exception ex)
            {
                // Handle write exceptions
                fileStatus = "Exception";
                fileContents = "ERROR: " + ex.ToString();
            }

            // Serialize response to JSON format
            returnTheData = JsonConvert.SerializeObject(new
            {
                status = fileStatus,
                description = fileContents
            });

            return returnTheData;
        }
    }
}