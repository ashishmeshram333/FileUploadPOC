using FileUploader.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace FileUploader.Controllers
{
    public class FileController : ApiController
    {
        public Task<IEnumerable<FileDetail>> Post()
        {
            string folderName = "Uploads";
            string PATH = ConfigurationManager.AppSettings["FileDestination"];
            string rootUrl = Request.RequestUri.AbsoluteUri.Replace(Request.RequestUri.AbsolutePath, String.Empty);
            if (Request.Content.IsMimeMultipartContent())
            {
                var streamProvider = new CustomMultipartFormDataStreamProvider(PATH);
                var task = Request.Content.ReadAsMultipartAsync(streamProvider).ContinueWith<IEnumerable<FileDetail>>(t =>
                {
                    if (t.IsFaulted || t.IsCanceled)
                    {
                        throw new HttpResponseException(HttpStatusCode.InternalServerError);
                    }

                    //var mystring = streamProvider.Contents[1].ToString();
                    
                    string paramName = streamProvider.FormData[0].ToString();

                    string paramValue = streamProvider.FormData.Keys[0].ToString();

                    var fileInfo = streamProvider.FileData.Select(i =>
                    {
                        var info = new FileInfo(i.LocalFileName);
                        using (System.IO.StreamWriter file = new System.IO.StreamWriter(PATH + @"\Data.txt",true))
                        {
                            file.WriteLine();
                            file.WriteLine("File Name: " + info.Name + " ***** Uploaded on (UTC) ***** " + DateTime.UtcNow + "**** Additional Info ***** " + paramName + " : " + paramValue);
                        }

                        return new FileDetail(info.Name, rootUrl + "/" + folderName + "/" + info.Name, info.Length / 1024);
                    });

                    return fileInfo;
                });
                return task;
            }
            else {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotAcceptable, "This request is not properly formatted"));
            }

        }
    }
}
