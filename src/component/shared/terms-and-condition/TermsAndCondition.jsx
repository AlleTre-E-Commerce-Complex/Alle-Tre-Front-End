import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { useLanguage } from "../../../context/language-context";
import localizationKeys from "../../../localization/localization-keys";
import content from "../../../localization/content";

const TermAndConditionData = [
  {
    title: { en: "Terms and Conditions:", ar: "الشروط و الأحكام :" },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            "ALLE TRE E-COMMERCE COMPLEX LLC OPC" welcomes you to the "ALLE TRE"
            platform, where we provide electronic auction services. By using the
            platform, you agree to be bound by the terms and conditions listed
            below. Please read this carefully, as your use of the platform
            constitutes full acceptance of these terms. If you do not agree,
            please refrain from using the platform.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            "ألي تري" مجمع للتعامل الإلكتروني ذ م م نرحب بكم في منصة “ألي تري”،
            حيث نقدم خدمات المزاد الإلكتروني. باستخدامك للمنصة، فإنك توافق على
            الالتزام بالشروط والأحكام المنصوص عليها أدناه. يُرجى قراءة هذه
            الشروط بعناية، حيث يمثل استخدامك للمنصة قبولًا كاملاً لهذه الشروط.
            في حال عدم موافقتك، يُرجى الامتناع عن استخدام المنصة.
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "1- Definitions", ar: "١- تعريفات : " },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            <span className="font-extrabold ">The platform :</span>The site of
            the ALLE TRE E-COMMERCE COMPLEX LLC OPC.
          </li>
          <li>
            <span className="font-extrabold ">Personal data :</span>Is any
            information or data related personally to the user and includes, but
            is not limited to (name - nationality. Gender - age - job title -
            address - phone number - email - payment card numbers - financial
            data - purchases. Participation in previous auctions - any other
            information) that is not available to the public in any form
            (received orally or collected through the use of non-printed forms
            or through or through the website).
          </li>
          <li>
            <span className="font-extrabold ">Auction service :</span>Is the
            process of accessing the electronic application or website to create
            an auction or to view the exhibits.
          </li>
          <li>
            <span className="font-extrabold ">Exhibit/ Exhibits :</span>Means
            all the goods on the website of ALLE TRE E-COMMERCE COMPLEX LLC OPC
            and the electronic application offered for sale and bidding on, for
            example, but not limited to (smart phones - and electronic devices).
          </li>
          <li>
            <span className="font-extrabold ">
              Seller/ First Party Supplier :
            </span>
            Means the owner , the requester of execution , their representatives
            , governmental, semi-governmental or private entities of all kinds
            who own the exhibits on the ALLE TRE E-COMMERCE COMPLEX LLC OPC and
            are permitted to sell goods and services through the platform.
          </li>
          <li>
            <span className="font-extrabold ">
              Buyer / Second Party / Customer :
            </span>
            Means the person who want to purchase any of the exhibits on the
            ALLE TRE E-COMMERCE COMPLEX LLC OPC website or the electronic
            application.
          </li>
          <li>
            <span className="font-extrabold ">Bidder :</span>
            Means the person who bids on the displayed goods at the highest
            price and the auction was awarded to him and is allowed to purchase
            the goods through the platform displayed by the user on the platform
            without intervention by ALLE TRE E-COMMERCE COMPLEX LLC OPC.
          </li>
          <li>
            <span className="font-extrabold ">Third Party :</span>
            Means the role and scope of responsibility of ALLE TRE E-COMMERCE
            COMPLEX LLC OPC as an intermediary in the sales process between the
            seller and the buyer through the platform, without obligation or
            responsibility towards them and has no relation to any illegal
            operations that may be carried out by any member of the auction
            members as well as the goods displayed through the platform.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            <span className="font-extrabold ">المنصة :</span>موقع ألي تري مجمع
            للتعامل الإلكتروني ذ م م ش ش و .
          </li>
          <li>
            <span className="font-extrabold ">البيانات الشخصية :</span>هي أي
            معلومات أو بيانات تتعلق شخصياً باللمستخدم وتضمن علي سبيل المثال لا
            الحصر ( الأسم - الجنسية – الجنس – العمر – المسمي الوظيفي – العنوان –
            رقم الهاتف – البريد الالكتروني – أرقام بطاقات الدفع – البيانات
            المالية – المشتريات – المشاركات فى مزادات سابقة ) أية معلومات أخرى
            لا تكون متاحه للعامة بأي شكل كان يتم تلقيها شفهياً أو يتم جمعها من
            خلال استخدام النماذج غير المطبوعه أو عن طريق أو من خلال الموقع
            الإلكتروني .
          </li>
          <li>
            <span className="font-extrabold ">خدمة المزاد :</span>هي عملية
            الوصول الى التطبيق الإلكتروني أو الموقع الإلكتروني لإنشاء مزاد او
            للاطلاع على المعروضات .
          </li>
          <li>
            <span className="font-extrabold ">المعروض / المعروضات:</span>ه.يقصد
            بها جميع السلع الموجودة على موقع ألي تري مجمع للتعامل الإلكتروني ذ م
            م ش ش و و و التطبيق الإلكتروني المعروضة للبيع و المزايدة عليها على
            سبيل المثال لا الحصر ( الهواتف الذكية - و الأجهزة الالكترونية ).
            للاطلاع على المعروضات .
          </li>
          <li>
            <span className="font-extrabold ">
              البائع / الطرف الأول المورد :
            </span>
            يقصد به مالك أو طالب التنفيذ أو من ينوب عنهم أو الجهات الحكومية أو
            شبه حكومية أو الخاصة بكافة أنواعها مالكة المعروضات علي موقع الي تري
            مجمع للتعامل الإلكتروني ويكون مسموح له ببيع السلع والخدمة عبر المنصة
            .
          </li>
          <li>
            <span className="font-extrabold ">
              المشتري / الطرف الثاني / العميل:
            </span>
            يقصد به الشخص الذي يرغب في شراء أياً من المعروضات على موقع ألي تري
            مجمع للتعامل الإلكتروني أوالتطبيق الإلكتروني .
          </li>
          <li>
            <span className="font-extrabold ">المزايد:</span> يقصد به الشخص الذي
            قام بالمزايدة على السلع المعروضة بأعلي سعر و تم ترسيه المزاد عليه و
            المسموح له بشراء السلع من خلال المنصة المعروضة من قبل المستخدم على
            المنصة دون تدخل من قبل ألي تري مجمع للتعامل الإلكتروني .
          </li>
          <li>
            <span className="font-extrabold ">الطرف الثالث:</span> يقصد به الشخص
            الذي قام بالمزايدة على السلع المعروضة بأعلي سعر و تم ترسيه المزاد
            عليه و المسموح له بشراء السلع من خلال المنصة المعروضة من قبل
            المستخدم على المنصة دون تدخل من قبل ألي تري مجمع للتعامل الإلكتروني
            .
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "2- Registration", ar: "٢-التسجيل :" },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            By using this site, you acknowledge that you are of legal age to
            enter into binding contracts and are not a person barred from
            receiving services under the laws of the United Arab Emirates or
            other competent laws. You also agree to provide true, accurate,
            current and complete information about yourself as prompted by the
            registration form on the site. If you provide any information that
            is untrue, inaccurate, not current or incomplete (or becomes untrue,
            inaccurate, not current or incomplete, or if ALLE TRE E-COMMERCE
            COMPLEX LLC OPC has reasonable grounds to suspect that such
            information is untrue, inaccurate, not current or incomplete), ALLE
            TRE Platform has the right to suspend or terminate your account and
            refuse any and all current or future use of the Site or any portion
            thereof and forfeit the security deposit. If you use the Site, you
            are responsible for maintaining the confidentiality of your account
            and password, and for restricting access to your computer. You agree
            to accept responsibility for all activities that occur under your
            account or password. Because of this, we strongly recommend that you
            log out of your account at the end of each session. You agree to
            immediately notify ALLE TRE of any not licensed use of your account
            or any security breach. ALLE TRE Platform Management reserves the
            right to refuse service, terminate accounts, or remove or edit
            content at its sole discretion.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            باستخدامك لهذا الموقع، أنت تقر أنك قد بلغت السن القانونية لإبرام
            عقود مُلزمه ولست شخصاً ممنوعاً من تلقي الخدمات بموجب قوانين دولة
            الإمارات العربية المتحدة أو القوانين المختصة الأخرى. أنت توافق أيضاً
            على تقديم معلومات صحيحة ودقيقة وحديثة وكاملة عن نفسك كما هو مطلوب في
            نموذج التسجيل على الموقع. إذا قدمت أي معلومات غير صحيحة أو غير دقيقة
            أو غير حديثة أو غير كاملة (أو ستصبح غير صحيحة أو غير دقيقة أو غير
            حديثة أو غير كاملة)، أو كان لدى ألي تري مجمع للتعامل الالكتروني
            أسباب مقنعة للاشتباه في هذه المعلومات بأنها غير صحيحة أو غير دقيقة
            أو غير حديثة أو غير كاملة، فإن منصة آلي تري لديها الحق في تعليق أو
            إنهاء حسابك و رفض أي وجميع استخداماتك الحالية أو المستقبلية للموقع
            (أو أي جزء منه) ومصادرة مبلغ التأمين . إذا كنت تستخدم الموقع، فأنت
            مسؤول عن الحفاظ على سرية حسابك وكلمة المرور، وتقييد الوصول إلى جهاز
            الحاسوب الخاص بك. أنت توافق على تحمل مسؤولية جميع الأنشطة التي تتم
            من خلال حسابك أو بكلمة مرورك. وبسبب هذا نحن نوصي بشدة بتسجيل الخروج
            من حسابك في نهاية كل جلسة. أنت توافق على إبلاغ ألي تري على الفور بأي
            استخدام غير مصرح به لحسابك أو أي خرق أمني. تحتفظ إدارة منصة ألي تري
            الحق في رفض الخدمة، أو إنهاء الحسابات، أو إزالة أو تعديل المحتوى حسب
            تقديرها .
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "3- Service Description ", ar: "٣-وصف الخدمة : " },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            The "ALLE TRE" platform is an electronic market that provides users
            with the ability to participate in auctions for electronic products.
            The platform provides users with opportunities to buy and sell
            products in a safe and easy-to-use manner.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            منصة “ألي تري” هي سوق إلكتروني توفر للمستخدمين إمكانية المشاركة في
            المزادات الخاصة بالمنتجات الإلكترونية. تقدم المنصة للمستخدمين فرص
            شراء وبيع المنتجات بطريقة آمنة وسهلة الاستخدام .
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "4- License and limited use ", ar: "٣-وصف الخدمة : " },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            ALLE TRE" grants you a limited license to use the platform for
            personal purposes. You may not:
            <ul className="list-disc pl-5">
              <li>Copy or publish content without permission.</li>
              <li>
                Use malicious software that aims to negatively affect the
                performance of the platform.
              </li>
            </ul>
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            منصة “ألي تري” هي سوق إلكتروني توفر للمستخدمين إمكانية المشاركة في
            المزادات الخاصة بالمنتجات الإلكترونية. تقدم المنصة للمستخدمين فرص
            شراء وبيع المنتجات بطريقة آمنة وسهلة الاستخدام .
          </li>
        </div>
      ),
    },
  },
  {
    title: {
      en: "4- License and limited use ",
      ar: "٤-الترخيص والاستخدام المحدود : ",
    },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            ALLE TRE" grants you a limited license to use the platform for
            personal purposes. You may not:
            <ul className="list-disc pl-5">
              <li>Copy or publish content without permission.</li>
              <li>
                Use malicious software that aims to negatively affect the
                performance of the platform.
              </li>
            </ul>
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            منصة “ألي تري” هي سوق إلكتروني توفر للمستخدمين إمكانية المشاركة في
            المزادات الخاصة بالمنتجات الإلكترونية. تقدم المنصة للمستخدمين فرص
            شراء وبيع المنتجات بطريقة آمنة وسهلة الاستخدام .
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "5-Content provided", ar: " ٥-المحتوى المقدّم :" },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            The content you provide on the platform remains your property, but
            you grant "ALLE TRE" a non-exclusive global license to use this
            content within the framework of providing the service. "ALLE TRE"
            reserves the right to remove or modify any content that violates the
            laws or policies of the platform.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            يبقى المحتوى الذي تقدمه على المنصة ملكًا لك، ولكنك تمنح “ألي تري”
            ترخيصًا عالميًا غير حصري لاستخدام هذا المحتوى في إطار تقديم الخدمة.
            تحتفظ “ألي تري” بحق إزالة أو تعديل أي محتوى يخالف القوانين أو سياسات
            المنصة.
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "6-Disclaimer", ar: "  ٦- إخلاء المسؤولية :" },
    parag: {
      en: (
        <div>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-bold">The role of the platform:</span>
              "ALLE TRE" acts as an intermediary to facilitate auction
              operations between sellers and bidders. The platform is not a
              party to the transactions and is not responsible for the quality
              or authenticity of the products offered.
            </li>
            <li className="mt-4">
              <span className="font-bold">Limited Liability</span>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  Any misleading or inaccurate information provided by sellers.
                </li>
                <li>
                  Any problems related to payment or financial transfer
                  operations.
                </li>
                <li>
                  Damages resulting from using the platform or participating in
                  auctions.
                </li>
                <li>
                  Indirect or consequential damages resulting from breach.
                </li>
              </ul>
            </li>
            <li className="mt-4">
              <span className="font-bold">Platform Obligations</span>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <span className="font-bold">
                    Providing a secure environment:
                  </span>
                  The platform seeks to ensure the security of information and
                  protect users' data through the use of encryption
                  technologies.
                </li>
                <li>
                  <span className="font-bold">Customer Support:</span>
                  The platform provides technical support to users to help them
                  solve any technical problems or inquiries related to auctions.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ),
      ar: (
        <div className="rtl text-right">
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-bold">دور المنصة:</span>
              تعمل [ألي تري] كوسيط لتسهيل عمليات المزاد بين البائعين والمزايدين.
              المنصة ليست طرفًا في المعاملات، ولا تتحمل المسؤولية عن جودة أو صحة
              المنتجات المعروضة.
            </li>
            <li className="mt-4">
              <span className="font-bold">المسؤولية المحدودة:</span>
              <ul className="list-disc ml-6 mt-2">
                <li>أي معلومات مضللة أو غير دقيقة مقدمة من البائعين.</li>
                <li>أي مشاكل تتعلق بعمليات الدفع أو التحويلات المالية.</li>
                <li>
                  الأضرار الناتجة عن استخدام المنصة أو المشاركة في المزادات.
                </li>
                <li>الأضرار غير المباشرة أو التبعية الناجمة عن الإخلال.</li>
              </ul>
            </li>
            <li className="mt-4">
              <span className="font-bold">التزامات المنصة:</span>
              <ul className="list-disc ml-6 mt-2">
                <li>
                  <span className="font-bold">تقديم بيئة آمنة:</span>
                  تسعى المنصة لضمان أمان المعلومات وحماية بيانات المستخدمين من
                  خلال استخدام تقنيات التشفير.
                </li>
                <li>
                  <span className="font-bold">دعم العملاء:</span>
                  توفر المنصة دعمًا فنيًا للمستخدمين لمساعدتهم في حل أي مشاكل
                  تقنية أو استفسارات تتعلق بالمزادات.
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ),
    },
  },
  {
    title: {
      en: "7 - Harm to the company, ALLE TRE E-COMMERCE COMPLEX LLC OPC",
      ar: "٧- الإضرار بشركة ألي تري مجمع للتعامل الإلكتروني:",
    },
    parag: {
      en: (
        <div>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-bold">Pledge not to hack:</span>
              You must not use any hacking or piracy programs to access the site
              or application, and adhere to the laws related to information
              technology, including Federal Decree-Law No. 5 of 2012 and its
              amendments.
            </li>
            <li className="mt-4">
              <span className="font-bold">
                Not to affect the infrastructure:
              </span>
              You must not carry out any activity that negatively affects the
              infrastructure of the site or application, or prevent users from
              accessing it.
            </li>
          </ul>
        </div>
      ),
      ar: (
        <div>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-bold">التعهد بعدم القرصنة:</span>
              يجب عدم استخدام أي برامج اختراق أو قرصنة للدخول إلى الموقع أو
              التطبيق، والالتزام بالقوانين المتعلقة بتقنية المعلومات، بما في ذلك
              المرسوم بقانون اتحادي رقم 5 لسنة 2012 وتعديلاته .
            </li>
            <li className="mt-4">
              <span className="font-bold">عدم التأثير على البنية التحتية</span>
              يجب عدم القيام بأي نشاط يؤثر سلبًا على البنية التحتية للموقع أو
              التطبيق، أو يمنع المستخدمين من الوصول إليه.
            </li>
          </ul>
        </div>
      ),
    },
  },
  {
    title: {
      en: "8- Guarantees",
      ar: "٨- الضمانات:",
    },
    parag: {
      en: (
        <div>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-bold"> No guarantees provided:</span>: ALLE
              TRE Company does not provide any guarantees for the items offered
              in the auction and acts as an intermediary to display the goods
              only. The buyer is responsible for verifying the item and its
              conformity to the specifications.
            </li>
            <li className="mt-4">
              <span className="font-bold">
                No responsibility for the information provided:
              </span>
              The company is not responsible for any statements, specifications
              or information provided by the seller.
            </li>
            <li className="mt-4">
              <span className="font-bold">Bidder's responsibility:</span>: The
              bidder or buyer is solely responsible for reviewing all data and
              information related to the condition of the item before bidding or
              purchasing.
            </li>
          </ul>
        </div>
      ),
      ar: (
        <div>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-bold">عدم تقديم ضمانات:</span>
              شركة ألي تري لا تقدم أي ضمانات للمعروضات في المزاد وتعمل كوسيط
              لعرض السلع فقط.و يكون على عاتق المشتري التأكد من المعروض و مطابقته
              للمواصفات .
            </li>
            <li className="mt-4">
              <span className="font-bold">
                عدم المسؤولية عن المعلومات المقدمة
              </span>
              يالشركة ليست مسؤولة عن أي إقرارات أو مواصفات أو معلومات يقدمها
              البائع.
            </li>
            <li className="mt-4">
              <span className="font-bold">مسؤولية المزايد</span>: المزايد أو
              المشتري هو المسؤول الوحيد عن مراجعة جميع البيانات والمعلومات
              المتعلقة بحالة المعروض قبل المزايدة أو الشراء.
            </li>
          </ul>
        </div>
      ),
    },
  },
  {
    title: {
      en: "9- Insurance:",
      ar: "٩– التأمين:",
    },
    parag: {
      en: (
        <div>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-semibold">Insurance Payment Method:</span>
              <ul className="list-disc ml-6 mt-1">
                <li>
                  Both the seller and the bidder must pay the insurance amount
                  in the manner specified by the platform, such as:
                </li>
                <ul className="list-disc ml-6">
                  <li>Credit card</li>
                  <li>Cash</li>
                  <li>Check</li>
                </ul>
                <li>
                  The insurance amount is disposed of in accordance with the
                  terms and conditions of the platform.
                </li>
              </ul>
            </li>
            <li className="mt-4">
              <span className="font-semibold">Insurance Percentage:</span>
              The insurance amount is displayed with each offer separately.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">
            Procedures related to the insurance amount:
          </h3>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-semibold">
                Confiscation of the insurance amount:
              </span>
              <ul className="list-disc ml-6 mt-1">
                <li>
                  <span className="font-semibold">For the seller:</span>
                  <ul className="list-disc ml-6">
                    <li>
                      In the event of cancellation of the auction before its
                      expiration:
                    </li>
                    <ul className="list-disc ml-6">
                      <li>
                        If there are no bidders, the insurance amount will be
                        refunded in full.
                      </li>
                      <li>
                        If there are bidders, The insurance amount will be
                        confiscated in full and The highest bidder will be
                        compensated with 30% of the insurance amount, and the
                        rest will go to the platform.
                      </li>
                    </ul>
                    <li>After the end of the auction:</li>
                    <ul className="list-disc ml-6">
                      <li>
                        If the seller does not comply, the insurance amount will
                        be confiscated in full.
                      </li>
                      <li>
                        The auction winner will be compensated with 50% of the
                        insurance amount, and the rest will go to the platform.
                      </li>
                    </ul>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">
                    For the bidder or buyer:
                  </span>
                  <ul className="list-disc ml-6">
                    <li>
                      The bidder is obligated to pay the full amounts within the
                      specified period and for the bidder or buyer, the
                      insurance percentage will be displayed separately
                      according to each offer..
                    </li>
                    <li>
                      In the event that the bidder does not comply with paying
                      the auction fees, the insurance amount will be confiscated
                      and the seller will be compensated with 50% of the
                      insurance amount and the rest will go to the platform.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="mt-4">
              <span className="font-semibold">Platform Charges:</span> ALLE TRE
              platform applies only 0.5% on each successful transaction within
              the platform for each user.
            </li>
            <li className="mt-4">
              <span className="font-semibold">Legal Responsibility:</span> ALLE
              TRE is not legally responsible for these violations, and legal
              action may be taken before the state courts.
            </li>
            <li className="mt-4">
              <span className="font-semibold">Deposit the Bid Amount:</span>
              In the event that the bidder wins, they must deposit the bid
              amount into ALLE TRE’s bank account within 72 hours from the date
              of the auction fees.
            </li>
          </ul>
        </div>
      ),
      ar: (
        <div>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-semibold">طريقة دفع التأمين:</span>
              <ul className="list-disc ml-6 mt-1">
                <li>
                  يجب على البائع والمزايد دفع مبلغ التأمين بالطريقة المحددة من
                  قبل المنصة، مثل:
                </li>
                <ul className="list-disc ml-6">
                  <li>بطاقة ائتمان</li>
                  <li>نقدًا</li>
                  <li>شيك</li>
                </ul>
                <li>يتم التصرف بمبلغ التأمين وفقًا لشروط وأحكام المنصة.</li>
              </ul>
            </li>
            <li className="mt-4">
              <span className="font-semibold">نسبة التأمين:</span>
              عرض مبلغ التأمين مع كل معروض بشكل منفصل .
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">
            الإجراءات المتعلقة بمبلغ التأمين:
          </h3>
          <ul className="list-decimal ml-6">
            <li className="mt-2">
              <span className="font-semibold">مصادرة مبلغ التأمين:</span>
              <ul className="list-disc ml-6 mt-1">
                <li>
                  <span className="font-semibold">بالنسبة للبائع :</span>
                  <ul className="list-disc ml-6">
                    <li>في حالة إلغاء المزاد قبل انتهاء موعده:</li>
                    <ul className="list-disc ml-6">
                      <li>
                        إذا لم يكن هناك مزايدون، سيتم استرداد مبلغ التأمين
                        بالكامل.
                      </li>
                      <li>
                        إذا كان هناك مزايدون، سيتم مصادرة مبلغ التأمين بالكامل
                        وسيتم تعويض أعلى مزايد بنسبة 30% من مبلغ التأمين،
                        والباقي يذهب إلى المنصة.
                      </li>
                    </ul>
                    <li>بعد انتهاء المزاد:</li>
                    <ul className="list-disc ml-6">
                      <li>
                        اذا لم يكن هناك أي مزايدين في المزاد سيتم رد مبلغ
                        التـأمين كاملاً
                      </li>
                      <li>
                        سيتم تعويض الفائز بالمزاد بنسبة 50% من مبلغ التأمين،
                        والباقي سيذهب إلى المنصة.
                      </li>
                    </ul>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">
                    بالنسبة للمزايد او المشتري
                  </span>
                  <ul className="list-disc ml-6">
                    <li>
                      يلتزم المزايد بسداد كامل المبالغ خلال المدة المحددة و سيتم
                      عرض نسبة التآأمين بشكل منفصل على حسب كل معروض.
                    </li>
                    <li>
                      في حالة عدم التزام المزايد بسداد مبلغ رسو المزاد سيتم
                      مصادرة مبلغ التأمين و يتم تعويض البائع بنسبة 50% من مبلغ
                      التأمين و الباقي للمنصة.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="mt-4">
              <span className="font-semibold">رسوم المنصة:</span> تطبق منصة
              Alletre نسبة 0.5% فقط على كل عملية ناجحة داخل المنصة، عن كل مستخدم
              .
            </li>
            <li className="mt-4">
              <span className="font-semibold">المسؤولية القانونية:</span> لا
              تعتبر شركة ألي تري غير مسؤولة قانونًا عن هذه المخالفات، ويمكن
              اتخاذ إجراءات قانونية أمام محاكم الدولة.
            </li>
            <li className="mt-4">
              <span className="font-semibold">إيداع مبلغ المعروض:</span>
              في حال فوز المزايد، يجب عليه إيداع مبلغ المزايدة في الحساب البنكي
              في حال فوز المزايد، يجب عليه إيداع مبلغ المعروض في الحساب البنكي
              الخاص بشركة ألي تري خلال 72 ساعة من تاريخ رسو المزاد .
            </li>
          </ul>
        </div>
      ),
    },
  },
  {
    title: { en: "10- Compensation", ar: " ١٠- التعويض :" },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            By accepting these terms, you agree to compensate ALLE TRE for any
            claims or lawsuits arising as a result of your violation of the
            terms or your violation of any law or third party rights.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            بقبولك لتلك الشروط فأنك توافقلى تعويض “ألي تري” عن أي مطالبات أو
            دعاوى تنشأ نتيجة انتهاكك للشروط أو مخالفتك لأي قانون أو حقوق طرف
            ثالث.
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "", ar: "" },
    parag: {
      en: (
        <div className="ml-4">
          <li>
            External links The platform may contain links to external sites.
            ALLE TRE is not responsible for the content of these links or any
            damages that may result from their use.
          </li>
          <li className="mt-4">
            Protection of intellectual property rights ALLE TRE respects
            intellectual property rights. Please contact us if you have a
            complaint regarding intellectual property rights infringement on the
            platform.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            الروابط الخارجية قد تحتوي المنصة على روابط لمواقع خارجية. لا تتحمل
            “ألي تري” مسؤولية محتوى هذه الروابط أو أي أضرار قد تنتج عن
            استخدامها.
          </li>
          <li className="mt-4">
            حماية حقوق الملكية الفكرية تحترم “ألي تري” حقوق الملكية الفكرية
            يُرجى التواصل معنا إذا كانت لديك شكوى تتعلق بانتهاك حقوق الملكية
            الفكرية على المنصة.
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "", ar: "" },
    parag: {
      en: (
        <div className="ml-4 -mt-5">
          <li>
            Laws and jurisdiction These terms and conditions are subject to and
            construed in accordance with the laws of [the Emirates] . This
            country is considered the legal seat for resolving disputes.
          </li>
          <ul className="list-disc ml-6 ">
            <li>
              <span className="font-semibold">Arbitration Condition:</span>
              <ul className="list-disc mt-1 ml-6">
                <li>
                  Any dispute that arises between the supplier (seller) and the
                  buyer (bidder), the platform of the ALLE TRE E-COMMERCE
                  COMPLEX LLC OPC shall arbitrate between them without the right
                  of either party to object to it, and the arbitration shall be
                  decided within 30 days from the date of the arbitration
                  request, and the decision issued shall be considered a final
                  settlement that is enforceable immediately upon its approval
                  by the platform of the ALLE TRE E-COMMERCE COMPLEX LLC OPC.
                </li>
                <li>
                  The number of arbitrators shall be (1) and the ALLE TRE
                  E-COMMERCE COMPLEX LLC OPC shall be competent to resolve the
                  dispute, and attendance shall be remote .
                </li>
                <li>
                  The language used in the arbitration shall be [Arabic or
                  English].
                </li>
                <li>
                  The applicable law shall be the law of the United Arab
                  Emirates .
                </li>
              </ul>
            </li>
          </ul>
        </div>
      ),
      ar: (
        <div className="ml-4">
          <li>
            القوانين والاختصاص القضائي تخضع هذه الشروط والأحكام لقوانين
            [الامارات ] وتُفسر وفقًا لها. تُعتبر هذه الدولة مقرًا قانونيًا لفض
            النزاعات.
          </li>
          <ul className="list-disc ml-6 ">
            <li>
              <span className="font-semibold">شرط التحكيم :</span>
              <ul className="list-disc mt-1 ml-6">
                <li>
                  أي نزاع ينشأ بين كلاً من المورد (البائع ) و المشتري ( المزايد
                  ) تقوم منصة ألي تري مجمع للتعامل الألكتروني بالتحكيم فيما
                  بينهم دون الحق للطرفين الاعتراض عليها و يتم الفصل في التحكيم
                  خلال 30 يوم من تاريخ طلب التحكيم و يعتبر القرار الصادر بمثابة
                  تسوية نهائياً قابل للنفاذ فور اعتماده من منصة ألي تري مجمع
                  للتعامل الالكتروني .
                </li>
                <li>
                  يكون عدد المحكمين (1) وتكون ألي تري مجمع للتعامل الالكتروني هى
                  المختصة بالفصل في النزاع و يكون الحضور عن بعد .
                </li>
                <li>
                  تكون اللغة المستخدمة في التحكيم هي [ اللغة العربية أو
                  الانجليزية ].
                </li>
                <li>يكون القانون الواجب التطبيق هو قانون دولة الإمارات .</li>
              </ul>
            </li>
          </ul>
        </div>
      ),
    },
  },
  {
    title: { en: "", ar: "" },
    parag: {
      en: (
        <div className="ml-4 -mt-8">
          <li>
            Amendments and Notifications ALLE TRE reserves the right to amend
            the terms and conditions at any time. You will be notified of the
            amendments via email or via a notice on the site, and your continued
            use of the site constitutes acceptance of the new terms.
          </li>
          <li className="mt-4">
            Termination of Service ALLE TRE reserves the right to suspend or
            terminate users' accounts in the event that they violate any of the
            terms and conditions, or in the event that they behave in a manner
            that is harmful to the platform or other users.
          </li>
          <li className="mt-4">
            Electronic Communication By using the platform, you agree to receive
            notices from ALLE TRE via email or via notices on the site. Any
            notice issued by ALLE TRE shall be considered an official notice.
          </li>
          <li className="mt-4">
            The headquarters of the company ALLE TRE is one of the properties of
            ALLE TRE E-COMMERCE COMPLEX LLC OPC.
          </li>
          <li className="mt-4">
            Inquiries In the event of any questions or inquiries regarding these
            terms and conditions, please contact us via email [About Technical
            Support and Customer Service] under the title Inquiries about the
            terms and conditions". Please ensure that you agree to these terms
            before starting to use the ALLE TRE platform.
          </li>
        </div>
      ),
      ar: (
        <div className="ml-4 -mt-8">
          <li>
            التعديلات والإخطارات تحتفظ “ألي تري” بحقها في تعديل الشروط والأحكام
            في أي وقت. سيتم إخطاركم بالتعديلات عبر البريد الإلكتروني أو عبر
            إشعار على الموقع، ويُعد استمراركم في استخدام الموقع قبولًا للشروط
            الجديدة.
          </li>
          <li className="mt-4">
            إنهاء الخدمة تحتفظ “ألي تري” بالحق في تعليق أو إنهاء حساب المستخدمين
            في حال انتهاكهم لأي من الشروط والأحكام، أو في حال سلوكهم بشكل ضار
            بالمنصة أو المستخدمين الآخرين.
          </li>
          <li className="mt-4">
            التواصل الإلكتروني باستخدامكم للمنصة، فإنكم توافقون على استقبال
            الإشعارات من “ألي تري” عبر البريد الإلكتروني أو عن طريق الإشعارات
            على الموقع. يُعتبر أي إشعار صادر عن “ألي تري” بمثابة إشعار رسمي.
          </li>
          <li className="mt-4">
            - مقر الشركة “ألي تري” هي من ممتلكات [ألي تري مجمع للتعامل
            الالكتروني].
          </li>
          <li className="mt-4">
            - الاستفسارات في حال وجود أي أسئلة أو استفسارات بخصوص هذه الشروط
            والأحكام، يُرجى التواصل معنا عبر البريد الإلكتروني [ الدعم الفني و
            خدمة العملاء ] بعنوان “استفسارات حول الشروط والأحكام”. يُرجى التأكد
            من موافقتك على هذه الشروط قبل البدء في استخدام منصة “ألي تري.
          </li>
        </div>
      ),
    },
  },
];

const TermsAndConditions = (isFooter) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="p-4">
      <TermsAndConditionsModal
        data={TermAndConditionData}
        isFooter={isFooter}
      />
    </div>
  );
};

const TermsAndConditionsModal = ({ data, isFooter }) => {
  const Footer = isFooter.isFooter;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [lang] = useLanguage("");
  const selectedContent = content[lang];

  const openModal = () => {
    if (!isTermsAccepted) {
      setIsModalOpen(true);
    } else {
      setIsTermsAccepted(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  const handleAcceptTerms = (e) => {
    setIsTermsAccepted(e.target.checked);
    if (e.target.checked) closeModal();
  };

  const isArabic = lang === "ar" ? "rtl text-right" : "";

  return (
    <div className={`mt-4 mx-1 flex justify-start ${isArabic}`}>
      <div className="mt-2">
        {Footer ? (
          <div>
             {selectedContent[localizationKeys.allRightsReserved]}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={openModal}
            >
              {selectedContent[localizationKeys.termsAndCondition]}
            </span>
          </div>
        ) : (
          <label className="text-gray-med text-sm font-normal group cursor-pointer">
            <input
              className="mt-0.5 ltr:mr-3 rtl:ml-3 bg-primary authcheckbox transition-all group-hover:scale-110"
              type="checkbox"
              required
              checked={isTermsAccepted}
              onChange={openModal}
            />
              {selectedContent[localizationKeys.iAcceptThe]}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={openModal}
            >
              {selectedContent[localizationKeys.termsAndCondition]}
            </span>
          </label>
        )}
      </div>

      {isModalOpen && (
        <div
          className=" fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="border-primary border-2 border-solid bg-white rounded-lg shadow-lg w-11/12 max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-black text-xl font-bold">
                  {selectedContent[localizationKeys.termsAndCondition]}
                </h2>
                <button
                  className="text-primary hover:text-red-500"
                  onClick={closeModal}
                >
                  <IoClose size={20} />
                </button>
              </div>
              <div className="overflow-y-auto max-h-96 mt-4">
                {data.map((e, index) => (
                  <div key={index}>
                    <h1 className="text-gray-verydark font-bold text-lg py-3">
                      {e?.title[lang]}
                    </h1>
                    <p className="text-gray-dark font-normal text-base pt-3 pb-10">
                      {e?.parag[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 border-t flex justify-end bg-gray-50">
              {Footer ? (
                <button
                  className="px-4 py-2 text-sm font-bold text-primary bg-primary-veryLight border border-primary shadow hover:bg-primary hover:text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                  onClick={closeModal}
                >
                  {selectedContent[localizationKeys.close]}
                </button>
              ) : (
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded  transition-all group-hover:scale-110"
                    checked={isTermsAccepted}
                    onChange={handleAcceptTerms}
                  />
                  <span>
                    {" "}
                    {
                      selectedContent[
                        localizationKeys.iAgreetotheTermsConditions
                      ]
                    }
                  </span>
                </label>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TermsAndConditions;
