using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MoisDeLaNutrition.Models
{
    public class JsonResponseModel
    {
        public bool IsSuccess { get; set; }
        public string Code { get; set; }
        public string Result { get; set; }
        public string ResultType { get; set; }
    }
}