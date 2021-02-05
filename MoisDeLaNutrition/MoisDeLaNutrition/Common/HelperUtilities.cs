using System;
using System.IO;
using System.Linq;
using System.Web;
using attitude.code;
using Umbraco.Core;
using Umbraco.Core.Models;
using Umbraco.Web;
using File = System.IO.File;
using System.Web.Mvc;

namespace MoisDeLaNutrition.Common
{
    public static class HelperUtilities
    {
        public static string StripGuid(string guid)
        {
            return guid.Replace("{", "").Replace("}", "").Replace("-", "");
        }

        /// <summary>
        /// This method takes an Umbraco node Id and either returns the associated file URL or an empty string.
        /// </summary>
        /// <param name="media"></param>
        /// <param name="height"></param>
        /// <param name="width"></param>
        /// <param name="fillCode"></param>
        /// <returns></returns>
        public static string GetMediaSrcOrEmptyString(IPublishedContent media, int height = 0, int width = 0, string fillCode = "ffffff")
        {
            if (media == null) return "";
            var pad = (height > 0 && width > 0) ? "?mode=pad" : "";
            var h = height > 0 ? "&height=" + height : "";
            var w = height > 0 ? "&width=" + width : "";
            var fill = string.IsNullOrWhiteSpace(fillCode) ? "" : "&bgcolor=" + fillCode;
            return (height > 0 && width > 0) ? media.Url + pad + h + w + fill : media.Url;
        }

        public static string GetMediaSrcOrEmptyString(int mediaId, int height = 0, int width = 0, string fillCode = "ffffff")
        {
            var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
            var node = umbracoHelper.TypedMedia(mediaId);
            return GetMediaSrcOrEmptyString(node, height, width, fillCode);
        }

        public static string GetMediaSrcOrEmptyString(string mediaId, int height = 0, int width = 0, string fillCode = "ffffff")
        {
            var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
            var media = mediaId.StringToInt();
            var node = umbracoHelper.TypedMedia(media);
            return GetMediaSrcOrEmptyString(node, height, width, fillCode);
        }

        public static IPublishedContent GetRecursiveParentOfType(this IPublishedContent node, string doctypeAlias)
        {
            while (node !=null && node.DocumentTypeAlias.ToLower() != doctypeAlias.ToLower())
            {
                node = node.Parent;
            }
            return node;
        }

        public static int GetImagineLandingId(IPublishedContent node)
        {
            var item = GetRecursiveParentOfType(node, "imaginelandingnode");
            return item.Id;
        }

        public static int GetLanguageLandingId(IPublishedContent node)
        {
            var item = GetRecursiveParentOfType(node, "brandlanding");
            return item.Id;
        }

        public static int GetCorpoLanguageLandingId(IPublishedContent node)
        {
            var item = GetRecursiveParentOfType(node, "corporatelanding");
            return item.Id;
        }

        public static IPublishedContent GetLanguageLandingNode(IPublishedContent node)
        {
            return GetRecursiveParentOfType(node, "brandlanding");
        }

        public static string GetLanguageFromUrl(string url)
        {
            return url.Contains("/fr/")?"fr":"en";
        }

        public static IPublishedContent GetSiteNode(string host)
        {
            var siteId = GetSiteId(host);
            if (siteId == -1) return null;
            var uh = new UmbracoHelper(UmbracoContext.Current);
            return uh.TypedContent(siteId);
        }

        public static int GetSiteId(string host)
        {
            var domainservice = ApplicationContext.Current.Services.DomainService;
            var domain = domainservice.GetAll(true).FirstOrDefault(x => x.DomainName == host);
            if (domain == null) return -1;
            var id = domain.RootContentId.HasValue ? domain.RootContentId.Value : -1;
            return id;
        }

        public static IHtmlString GetDict(string key)
        {
            try
            {
                var umbracoHelper = new UmbracoHelper(UmbracoContext.Current);
                return new HtmlString(umbracoHelper.GetDictionaryValue(key));
            }
            catch(Exception ex)
            {
                return new HtmlString(key);
            }
        }

        public static string StringToUrl(this string value)
        {
            if (string.IsNullOrWhiteSpace(value)) return "";
            return value.RemoveDiacritics().Replace("  ", " ").Replace(" ", "-");
        }
        

        /// <summary>
        /// This will write a file to disk, over writing a file if it exists
        /// </summary>
        /// <param name="contents"></param>
        /// <param name="path"></param>
        /// <param name="fileName"></param>
        /// <returns>true if successful else an error</returns>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="DirectoryNotFoundException"></exception>
        /// <exception cref="IOException"></exception>
        /// <exception cref="NotSupportedException"></exception>
        /// <exception cref="PathTooLongException"></exception>
        /// <exception cref="UnauthorizedAccessException"></exception>
        public static bool WriteFile(string contents, string path, string fileName)
        {
            //make sure directory exists if not create
            var created = CreateDirectory(path);

            if (!created) return false;

            var filePath = Path.Combine(path, fileName);

            if (!File.Exists(path))
            {
                File.Delete(filePath);
            }

            using (var sw = File.CreateText(path))
            {
                sw.WriteLine(contents);
            }

            return true;
        }

        /// <summary>
        /// Creates a directory with the provided path
        /// </summary>
        /// <param name="path"></param>
        /// <returns>true if directory is created or exists else an error</returns>
        /// <exception cref="IOException"></exception>
        /// <exception cref="UnauthorizedAccessException"></exception>
        /// <exception cref="ArgumentException"></exception>
        /// <exception cref="ArgumentNullException"></exception>
        /// <exception cref="PathTooLongException"></exception>
        /// <exception cref="DirectoryNotFoundException"></exception>
        /// <exception cref="NotSupportedException"></exception>
        public static bool CreateDirectory(string path)
        {
            if (Directory.Exists(path)) return true;
            Directory.CreateDirectory(path);
            return true;
        }

        public static string RenderPartialViewToString(this Controller controller, string viewName, object model)
        {
            if (string.IsNullOrEmpty(viewName))
            {
                viewName = controller.ControllerContext.RouteData.GetRequiredString("action");
            }

            controller.ViewData.Model = model;

            using (var sw = new StringWriter())
            {
                // Find the partial view by its name and the current controller context.
                ViewEngineResult viewResult = ViewEngines.Engines.FindPartialView(controller.ControllerContext, viewName);

                // Create a view context.
                var viewContext = new ViewContext(controller.ControllerContext, viewResult.View, controller.ViewData, controller.TempData, sw);

                // Render the view using the StringWriter object.
                viewResult.View.Render(viewContext, sw);

                return sw.GetStringBuilder().ToString();
            }
        }
    }
}
