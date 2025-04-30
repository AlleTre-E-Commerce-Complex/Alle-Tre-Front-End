import React, { useEffect, useState } from "react";
import { useLanguage } from "../../../context/language-context";
import { Link, useHistory } from "react-router-dom";
import routes from "../../../routes";
import { useDispatch } from "react-redux";
import { Open } from "../../../redux-store/auth-model-slice";
import { useAuthState } from "../../../context/auth-context";

const PrivacyPolicy = ({ isFooter }) => {
  const [copied, setCopied] = useState(false);
  const [lang] = useLanguage();
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useAuthState();

  useEffect(() => {
    if (!isFooter) {
      window.scrollTo(0, 0);
    }
  }, [isFooter]);

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    if (user) {
      history.push(routes.app.privacyPolicy);
    } else {
      dispatch(Open());
    }
  };

  const handleCopyEmail = (e) => {
    e.preventDefault(); // Stop mail client opening
    navigator.clipboard.writeText("support@alletre.com").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2s
    });
  };

  if (isFooter) {
    return (
      <Link
        to={routes.app.privacyPolicy}
        onClick={handlePrivacyClick}
        className="hover:text-white mt-6"
      >
        {lang === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
      </Link>
    );
  }

  return (
    <div
      className=" min-h-screen bg-gray-light bg-opacity-50"
      style={{
        backgroundImage:
          'url(\'data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23a91d3a" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\')',
      }}
    >
      <div className="container mx-auto px-4 py-8 mt-32 max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-veryLight">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent font-serifEN">
            {lang === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
          </h1>
          <div className="space-y-6 text-gray">
            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-light bg-opacity-50 p-6 rounded-lg mb-8 shadow-sm">
              <p className="mb-2 sm:mb-0 font-medium">
                {lang === "en"
                  ? "Effective Date: 01/01/2025"
                  : "تاريخ النفاذ: 01/01/2025"}
              </p>
              <p className="mb-2 sm:mb-0 font-medium">
                {lang === "en"
                  ? "Website: www.alletre.com"
                  : "الموقع: www.alletre.com"}
              </p>
              <p className="font-medium">
                {lang === "en" ? "App Name: Alletre" : "اسم التطبيق: Alletre"}
              </p>
            </div>

            <section className="mb-8 hover:bg-gray-light hover:bg-opacity-50 p-6 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-veryLight">
              <h2 className="text-2xl font-semibold mb-4 text-primary font-serifEN">
                {lang === "en"
                  ? "Information We Collect"
                  : "المعلومات التي نجمعها"}
              </h2>
              <ul className="list-none space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "Personal details (name, email, phone number)"
                    : "البيانات الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف)"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "Location data (if allowed)"
                    : "بيانات الموقع الجغرافي (إذا تم السماح بها)"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "Bidding activity and transaction history"
                    : "نشاط المزايدة وسجل المعاملات"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "Device and browser information"
                    : "معلومات الجهاز والمتصفح"}
                </li>
              </ul>
            </section>

            <section className="mb-8 hover:bg-gray-light hover:bg-opacity-50 p-6 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-veryLight">
              <h2 className="text-2xl font-semibold mb-4 text-primary font-serifEN">
                {lang === "en"
                  ? "How We Use Your Information"
                  : "كيفية استخدام المعلومات"}
              </h2>
              <ul className="list-none space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "To provide and improve our services"
                    : "لتقديم وتحسين خدماتنا"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "To manage your account and listings"
                    : "لإدارة حسابك وقوائمك"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "To process payments and bids"
                    : "لمعالجة المدفوعات والمزايدات"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "To communicate with you (notifications, offers, updates)"
                    : "للتواصل معك (تنبيهات، عروض، تحديثات)"}
                </li>
              </ul>
            </section>

            <section className="mb-8 hover:bg-gray-light hover:bg-opacity-50 p-6 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-veryLight">
              <h2 className="text-2xl font-semibold mb-4 text-primary font-serifEN">
                {lang === "en" ? "Sharing of Information" : "مشاركة المعلومات"}
              </h2>
              <ul className="list-none space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "We do not sell your information."
                    : "لا نقوم ببيع معلوماتك."}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "We may share data with third-party service providers (e.g., payment processors, analytics tools)."
                    : "قد نشارك البيانات مع مزودي الخدمات الخارجيين (مثل بوابات الدفع وأدوات التحليل)."}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "We may disclose information if required by law."
                    : "قد نكشف عن المعلومات إذا طُلب ذلك قانونيًا."}
                </li>
              </ul>
            </section>

            <section className="mb-8 hover:bg-gray-light hover:bg-opacity-50 p-6 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-veryLight">
              <h2 className="text-2xl font-semibold mb-4 text-primary font-serifEN">
                {lang === "en" ? "Your Rights" : "حقوقك"}
              </h2>
              <ul className="list-none space-y-3">
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "Access or update your personal information"
                    : "الوصول إلى بياناتك أو تعديلها"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en" ? "Delete your account" : "حذف حسابك"}
                </li>
                <li className="flex items-center">
                  <span className="h-2 w-2 bg-primary rounded-full mr-3"></span>
                  {lang === "en"
                    ? "Control notification settings"
                    : "التحكم في إعدادات الإشعارات"}
                </li>
              </ul>
            </section>

            <section className="mb-8 hover:bg-gray-light hover:bg-opacity-50 p-6 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-veryLight">
              <h2 className="text-2xl font-semibold mb-4 text-primary font-serifEN">
                {lang === "en" ? "Data Security" : "حماية البيانات"}
              </h2>
              <p className="leading-relaxed">
                {lang === "en"
                  ? "We use secure technologies to protect your data from unauthorized access or misuse."
                  : "نستخدم تقنيات أمان متقدمة لحماية بياناتك من الوصول غير المصرح به أو سوء الاستخدام."}
              </p>
            </section>

            <section className="mb-8 hover:bg-gray-light hover:bg-opacity-50 p-6 rounded-lg transition-all duration-300 border border-transparent hover:border-gray-veryLight">
              <h2 className="text-2xl font-semibold mb-4 text-primary font-serifEN">
                {lang === "en" ? "Updates to This Policy" : "تحديثات السياسة"}
              </h2>
              <p className="leading-relaxed">
                {lang === "en"
                  ? "We may update this policy from time to time. Continued use of our services means you accept the updated terms."
                  : "قد نقوم بتحديث هذه السياسة من وقت لآخر. استمرارك في استخدام خدماتنا يعني موافقتك على الشروط الجديدة."}
              </p>
            </section>

            <section className="mb-8 bg-primary-veryLight p-6 rounded-lg transition-all duration-300 border border-primary border-opacity-10">
              <h2 className="text-2xl font-semibold mb-4 text-primary font-serifEN">
                {lang === "en" ? "Contact Us" : "تواصل معنا"}
              </h2>
              <p className="leading-relaxed">
                {lang === "en"
                  ? "If you have any questions, contact us at: "
                  : "لأي استفسار، يمكنك التواصل معنا عبر البريد الإلكتروني: "}
                <a
                  href="#"
                  onClick={handleCopyEmail}
                  className="text-primary hover:text-primary-dark underline"
                >
                  support@alletre.com
                </a>
                {copied && (
                  <span className="ml-2 text-green-500 text-sm">Copied!</span>
                )}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
