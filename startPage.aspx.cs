/*
 * FILE:             StartName.aspx.cs
 * PROJECT:          PROG2001-Assignement 05 Text Editior
 * PROGRAMMER:       Zemmat Hagos, Najaf Ali
 * FIRST VERSION:    2025-12-05
 * DESCRIPTION:      provides the webmethods and allows the client to list save and read file contents
 * 
 *                   
 */
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Web.Services;
using System.Diagnostics;
using Newtonsoft.Json;

namespace SEANTextEditor
{
    public partial class startPage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }


        [WebMethod]
        /// <summary>
        /// this will check the list
        /// </summary>
        /// <returns></returns>
        public static string GetFileList()
        {
            // declare variables to hold and return data and status information
            string returnTheData;
            string fileStatus;
            string fileContents;
            
            // used try catch block to check any exceptions

            try
            {
                string folderPath = HttpContext.Current.Server.MapPath("~/MyFiles"); // this will build the complete the file path

                // created if directory to see if the directory exists
                if (Directory.Exists(folderPath))
                {
                    string[] checkFile = Directory.GetFiles(folderPath); // this will get every file path inside the folder

                    List<string> fileNames = new List<string>(); // made a list to store only the file names

                    // loop thriugh each file thats found
                    foreach(string file in checkFile)
                    {
                        fileNames.Add(Path.GetFileName(file)); // extract and remove the folder path
                    }

                    fileStatus = "Success"; // display that the files have been sucessfully retrieved

                    returnTheData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileNames }); // convert into JSON for the browser

                    return returnTheData;
                }
                
                // else when the directory wasn't found
                else
                {
                    fileStatus = "Failure";
                    fileContents = "the directory doesn't exist";

                }
            }

            // make sure you catch any unexpected errors
            catch (Exception e)
            {
                
                fileStatus = "Exception";
                fileContents = "ERROR: " + e.ToString();
            }

            returnTheData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileContents });

            return returnTheData;


        }

        [WebMethod]

        /// <summary>
        /// this will read the contents of a selected file
        /// </summary>
        /// <returns></returns>
        public static string GetFileContents(string fileName)
        {
            // declare variables to hold and return data and status information
            string returnTheData;
            string fileStatus;
            string fileContents;


            // used try catch block to check any exceptions
            try
            {

                string folderPath = HttpContext.Current.Server.MapPath("~/MyFiles"); // this will get the physical path of the folders containing the files
                
                string filePath = folderPath + "\\" + fileName; // this will build the complete the file path

                // check if the file exists before it trys to read it
                if (File.Exists(filePath))
                {

                    fileContents = File.ReadAllText(filePath); // this will read the entire file
                    fileStatus = "Success";

                    returnTheData = JsonConvert.SerializeObject(new { status = fileStatus, contents = fileContents });

                    return returnTheData;
                }

                else
                {
                    fileStatus = "Failure";
                    fileContents = "File doesn't exist";

                }
            }
            catch (Exception e)
            {

                fileStatus = "Exception";
                fileContents = "ERROR: " + e.ToString();
            }

            returnTheData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileContents });

            return returnTheData;
        
        }

        [WebMethod]

        /// <summary>
        /// this will save the file when selected
        /// </summary>
        /// <returns></returns>
        public static  string SaveTheFile(string fileName, string getContents)
        {
            // declare variables to hold and return data and status information
            string returnTheData;
            string fileStatus;
            string fileContents;
            string filePath;
            string folderPath;

            // used try catch block to check any exceptions
            try
            {
                folderPath = HttpContext.Current.Server.MapPath("~/MyFiles"); // this will get the physical path of the folders containing the files
               
                filePath = folderPath + "\\" + fileName; // this will build the complete the file path
                
                File.WriteAllText(filePath, getContents); // this will write all the text content to the file
                
                fileStatus = "Success"; // set the staus to show its sucessful

                fileContents = "File saved successfully"; // and for the file to be saved sucessfully

               
            }

            // this will block to handle any exceptions
            catch (Exception e)
            {
                // 
                fileStatus = "Exception";
                fileContents = "ERROR: " + e.ToString();
            }

            returnTheData = JsonConvert.SerializeObject(new { status = fileStatus, description = fileContents }); // used an anoymous object with status and error message to JSON

            return returnTheData;

        }
    }
    }