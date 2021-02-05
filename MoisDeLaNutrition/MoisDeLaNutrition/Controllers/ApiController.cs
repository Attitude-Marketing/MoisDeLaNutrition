using System;
using System.Linq;
using System.Web.Mvc;
using System.Collections.Generic;
using MoisDeLaNutrition.Models;
using attitude.code;
using attitude.code.Common.Models;
using Umbraco.Core;
using Umbraco.Web.Mvc;
using Newtonsoft.Json;
using Umbraco.Web;
using System.Web;
using System.IO;
using Umbraco.Core.Models;
using System.Net.Http;
using RestSharp;
using MoisDeLaNutrition.Common;

namespace DFC_Maritimes.Controllers
{
    public class ApiController : SurfaceController
    {
        public ActionResult GetToken()
        {
            var client = new RestClient("https://mcwp073nk52bd-gtj2r07rh52lz0.auth.marketingcloudapis.com/v2/Token");
            var request = new RestRequest(Method.POST);
            request.RequestFormat = DataFormat.Json;
            request.AddHeader("Accept", "application/json");
            request.AddJsonBody(new { grant_type = "client_credentials", client_id = "486dr8u5agmt3bavyjykgtf6", client_secret = "3I8RoHESXqqkqelv4CIjJERf", account_id = "514000479" });
            IRestResponse recievedtoken = client.Execute(request);

            if (recievedtoken == null || recievedtoken.StatusCode.Equals(System.Net.HttpStatusCode.BadRequest))
            {
                return Content(JsonConvert.SerializeObject(new JsonResponseModel
                {
                    Code = "2",
                    IsSuccess = false,
                    Result = recievedtoken.StatusCode.ToString(),
                    ResultType = "text"
                }));
            }

            return Content(JsonConvert.SerializeObject(new JsonResponseModel
            {
                Code = "1",
                IsSuccess = true,
                Result = JsonConvert.SerializeObject(recievedtoken.Content),
                ResultType = "text"
            }));

        }

        [HttpPost]
        public ActionResult NewsletterOptIn(NewsletterFormModel model)
        {
            if (!string.IsNullOrWhiteSpace(model.Captcha))
            {
                return Content(JsonReturnModel.Serialize());
            }

            if (string.IsNullOrWhiteSpace(model.Email))
            {
                return Content(JsonConvert.SerializeObject(new JsonResponseModel
                {
                    Code = "1",
                    IsSuccess = false,
                    Result = HelperUtilities.GetDict("required fields missing").ToString(),
                    ResultType = "text"
                }));
            }
            var token = model.Token;

            var endpoint = new RestClient("https://mcwp073nk52bd-gtj2r07rh52lz0.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:4A84B2E0-86BB-41A0-8638-84AFCD7B37EF/rows");
            var endrequest = new RestRequest(Method.POST);
            var now = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
            var lang_en = "";
            var lang_fr = "";

            if(!model.Userlang.IsNullOrWhiteSpace())
            {
                if (model.Userlang == "en")
                {
                    lang_en = "true";
                    lang_fr = "false";
                }
                else
                {
                    lang_en = "false";
                    lang_fr = "true";
                }
            }

            endrequest.RequestFormat = DataFormat.Json;
            endrequest.AddHeader("Authorization", string.Format("Bearer {0}", token));

            var requestring = string.Format("{{ \"items\" : [{{ \"subscriber_key\" : \"{0}\", \"email\" : \"{1}\", \"first_name\" : \"\", \"last_name\" : \"\", \"country\": \"canada\", \"source\" : \"NUTRITION_MONTH_MS\", \"domain\" : \"whatyoueat.ca\", \"subscribed_to\" : \"DairyGoodness_Newsletter\", \"language_english\" : \"{2}\", \"language_french\" : \"{3}\", \"subscribed_to_dairy_goodness\" : \"true\", \"create_date\" : \"{4}\" }}] }}", model.Email.Trim(), model.Email.Trim(), lang_en, lang_fr, now);
            endrequest.AddJsonBody(requestring);


            IRestResponse recievedResponse = endpoint.Execute(endrequest);

            if (recievedResponse == null || recievedResponse.StatusCode.Equals(System.Net.HttpStatusCode.BadRequest))
            {
                return Content(JsonConvert.SerializeObject(new JsonResponseModel
                {
                    Code = "3",
                    IsSuccess = false,
                    Result = recievedResponse.StatusCode.ToString(),
                    ResultType = "text"
                }));
            }


            return Content(JsonConvert.SerializeObject(new JsonResponseModel
            {
                Code = "1",
                IsSuccess = true,
                Result = "ok",
                ResultType = "text"
            }));
        }
    }

}