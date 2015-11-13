using FileUploader.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
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

                    StringBuilder paramString = new StringBuilder();
                    for(int i =0;i < streamProvider.FormData.Keys.Count;i++)
                    {
                        paramString.Append(streamProvider.FormData.Keys[i].ToString() + " : " + streamProvider.FormData[i].ToString());
                        paramString.Append("****");
                    }
                    
                    //string paramName = streamProvider.FormData.Keys[0].ToString();

                    //string paramValue = streamProvider.FormData[0].ToString();

                    //string paramName1 = streamProvider.FormData.Keys[1].ToString();

                    //string paramValue1 = streamProvider.FormData[1].ToString();

                    var fileInfo = streamProvider.FileData.Select(i =>
                    {
                        var info = new FileInfo(i.LocalFileName);
                        using (System.IO.StreamWriter file = new System.IO.StreamWriter(PATH + @"\Data.txt",true))
                        {
                            file.WriteLine();
                            file.WriteLine("File Name: " + info.Name + " ***** Uploaded on (UTC) ***** " + DateTime.UtcNow + "**** Additional Info ***** " + paramString.ToString());
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
