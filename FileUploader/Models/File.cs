using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace FileUploader.Models
{
    [DataContract]
    public class FileDetail
    {
        [DataMember]
        public string name { get; set; }

        [DataMember]
        public string path { get; set; }

        [DataMember]
        public long size { get; set; }

        public FileDetail()
        {

        }

        public FileDetail(string name, string path, long size)
        {
            this.name = name;
            this.path = path;
            this.size = size;
        }
    }
}