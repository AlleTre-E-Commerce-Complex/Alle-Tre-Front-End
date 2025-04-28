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
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">The platform :</span>The site of
            the ALLE TRE E-COMMERCE COMPLEX LLC OPC.
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">Personal data :</span>Is any
            information or data related personally to the user and includes, but
            is not limited to (name - nationality. Gender - age - job title -
            address - phone number - email - payment card numbers - financial
            data - purchases. Participation in previous auctions - any other
            information) that is not available to the public in any form
            (received orally or collected through the use of non-printed forms
            or through or through the website).
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">Auction service :</span>Is the
            process of accessing the electronic application or website to create
            an auction or to view the exhibits.
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">Exhibit/ Exhibits :</span>Means
            all the goods on the website of ALLE TRE E-COMMERCE COMPLEX LLC OPC
            and the electronic application offered for sale and bidding on, for
            example, but not limited to (smart phones - and electronic devices).
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">
              Seller/ First Party Supplier :
            </span>
            Means the owner , the requester of execution , their representatives
            , governmental, semi-governmental or private entities of all kinds
            who own the exhibits on the ALLE TRE E-COMMERCE COMPLEX LLC OPC and
            are permitted to sell goods and services through the platform.
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">
              Buyer / Second Party / Customer :
            </span>
            Means the person who want to purchase any of the exhibits on the
            ALLE TRE E-COMMERCE COMPLEX LLC OPC website or the electronic
            application.
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">Bidder :</span>
            Means the person who bids on the displayed goods at the highest
            price and the auction was awarded to him and is allowed to purchase
            the goods through the platform displayed by the user on the platform
            without intervention by ALLE TRE E-COMMERCE COMPLEX LLC OPC.
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">Third Party :</span>
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
        <div className="mx-2 sm:mx-4">
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">المنصة :</span>موقع ألي تري مجمع
            للتعامل الإلكتروني ذ م م ش ش و .
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">البيانات الشخصية :</span>هي أي
            معلومات أو بيانات تتعلق شخصياً باللمستخدم وتضمن علي سبيل المثال لا
            الحصر ( الأسم - الجنسية – الجنس – العمر – المسمي الوظيفي – العنوان –
            رقم الهاتف – البريد الالكتروني – أرقام بطاقات الدفع – البيانات
            المالية – المشتريات – المشاركات فى مزادات سابقة ) أية معلومات أخرى
            لا تكون متاحه للعامة بأي شكل كان يتم تلقيها شفهياً أو يتم جمعها من
            خلال استخدام النماذج غير المطبوعه أو عن طريق أو من خلال الموقع
            الإلكتروني .
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">خدمة المزاد :</span>هي عملية
            الوصول الى التطبيق الإلكتروني أو الموقع الإلكتروني لإنشاء مزاد او
            للاطلاع على المعروضات .
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">المعروض / المعروضات:</span>ه.يقصد
            بها جميع السلع الموجودة على موقع ألي تري مجمع للتعامل الإلكتروني ذ م
            م ش ش و و و التطبيق الإلكتروني المعروضة للبيع و المزايدة عليها على
            سبيل المثال لا الحصر ( الهواتف الذكية - و الأجهزة الالكترونية ).
            للاطلاع على المعروضات .
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">
              البائع / الطرف الأول المورد :
            </span>
            يقصد به مالك أو طالب التنفيذ أو من ينوب عنهم أو الجهات الحكومية أو
            شبه حكومية أو الخاصة بكافة أنواعها مالكة المعروضات علي موقع الي تري
            مجمع للتعامل الإلكتروني ويكون مسموح له ببيع السلع والخدمة عبر المنصة
            .
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">
              المشتري / الطرف الثاني / العميل:
            </span>
            يقصد به الشخص الذي يرغب في شراء أياً من المعروضات على موقع ألي تري
            مجمع للتعامل الإلكتروني أوالتطبيق الإلكتروني .
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">المزايد:</span> يقصد به الشخص الذي
            قام بالمزايدة على السلع المعروضة بأعلي سعر و تم ترسيه المزاد عليه و
            المسموح له بشراء السلع من خلال المنصة المعروضة من قبل المستخدم على
            المنصة دون تدخل من قبل ألي تري مجمع للتعامل الإلكتروني .
          </li>
          <li>
            <span className="font-bold sm:font-extrabold block sm:inline mb-1 sm:mb-0">الطرف الثالث:</span> يقصد به الشخص
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
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
          <li>
            The "ALLE TRE" platform is an electronic market that provides users
            with the ability to participate in auctions for electronic products.
            The platform provides users with opportunities to buy and sell
            products in a safe and easy-to-use manner.
          </li>
        </div>
      ),
      ar: (
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
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
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-bold">The role of the platform:</span>
              "ALLE TRE" acts as an intermediary to facilitate auction
              operations between sellers and bidders. The platform is not a
              party to the transactions and is not responsible for the quality
              or authenticity of the products offered.
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-bold">Limited Liability</span>
              <ul className="list-disc ml-3 sm:ml-6 mt-2">
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
            <li className="mt-3 sm:mt-4">
              <span className="font-bold">Platform Obligations</span>
              <ul className="list-disc ml-3 sm:ml-6 mt-2">
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
        <div className="rtl text-right px-2 sm:px-4">
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-bold">دور المنصة:</span>
              تعمل [ألي تري] كوسيط لتسهيل عمليات المزاد بين البائعين والمزايدين.
              المنصة ليست طرفًا في المعاملات، ولا تتحمل المسؤولية عن جودة أو صحة
              المنتجات المعروضة.
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-bold">المسؤولية المحدودة:</span>
              <ul className="list-disc ml-3 sm:ml-6 mt-2">
                <li>أي معلومات مضللة أو غير دقيقة مقدمة من البائعين.</li>
                <li>أي مشاكل تتعلق بعمليات الدفع أو التحويلات المالية.</li>
                <li>
                  الأضرار الناتجة عن استخدام المنصة أو المشاركة في المزادات.
                </li>
                <li>الأضرار غير المباشرة أو التبعية الناجمة عن الإخلال.</li>
              </ul>
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-bold">التزامات المنصة:</span>
              <ul className="list-disc ml-3 sm:ml-6 mt-2">
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
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-bold">Pledge not to hack:</span>
              You must not use any hacking or piracy programs to access the site
              or application, and adhere to the laws related to information
              technology, including Federal Decree-Law No. 5 of 2012 and its
              amendments.
            </li>
            <li className="mt-3 sm:mt-4">
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
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-bold">التعهد بعدم القرصنة:</span>
              يجب عدم استخدام أي برامج اختراق أو قرصنة للدخول إلى الموقع أو
              التطبيق، والالتزام بالقوانين المتعلقة بتقنية المعلومات، بما في ذلك
              المرسوم بقانون اتحادي رقم 5 لسنة 2012 وتعديلاته .
            </li>
            <li className="mt-3 sm:mt-4">
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
    title: { en: "8- Auction Integrity", ar: "٨- نزاهة المزاد:" },
    parag: {
      en: (
        <div className="mx-2 sm:mx-4">
          <li>
            The ALLE TRE E-COMMERCE COMPLEX LLC OPC platform is committed to
            ensuring the integrity and transparency of auctions. Therefore, it
            is strictly prohibited for the seller, directly or indirectly, to
            participate as a bidder in the auction of the product he has offered
            for sale, whether using his personal account or another account
            belonging to him or any person acting on his behalf. In the event
            that any attempt to circumvent this condition is discovered, the
            platform management reserves the right to take the necessary
            measures, which include canceling the auction, confiscating the
            insurance amount, and blocking the accounts involved in order to
            maintain a fair experience for all users.
          </li>
        </div>
      ),
      ar: (
        <div className="mx-2 sm:mx-4">
          <li>
            تلتزم منصة الي تري بضمان نزاهة وشفافية المزادات. لذا، يُمنع تمامًا
            على البائع سواء بشكل مباشر أو غير مباشر، المشاركة كمزايد في المزاد
            الخاص بالمنتج الذي عرضه للبيع، سواء باستخدام حسابه الشخصي أو حساب
            آخر تابع له أو لأي شخص ينوب عنه. في حال اكتشاف أي محاولة للتحايل على
            هذا الشرط، تحتفظ إدارة المنصة بحق اتخاذ الإجراءات اللازمة، والتي
            تشمل إلغاء المزاد، مصادرة مبلغ التأمين، وحظر الحسابات المتورطة،
            حفاظًا على عدالة التجربة لجميع المستخدمين
          </li>
        </div>
      ),
    },
  },
  {
    title: {
      en: "9- Guarantees",
      ar: "٩– الضمانات:",
    },
    parag: {
      en: (
        <div>
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-bold"> No guarantees provided:</span>: ALLE
              TRE Company does not provide any guarantees for the items offered
              in the auction and acts as an intermediary to display the goods
              only. The buyer is responsible for verifying the item and its
              conformity to the specifications.
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-bold">
                No responsibility for the information provided:
              </span>
              The company is not responsible for any statements, specifications
              or information provided by the seller.
            </li>
            <li className="mt-3 sm:mt-4">
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
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-bold">عدم تقديم ضمانات:</span>
              شركة ألي تري لا تقدم أي ضمانات للمعروضات في المزاد وتعمل كوسيط
              لعرض السلع فقط.و يكون على عاتق المشتري التأكد من المعروض و مطابقته
              للمواصفات .
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-bold">
                عدم المسؤولية عن المعلومات المقدمة
              </span>
              يالشركة ليست مسؤولة عن أي إقرارات أو مواصفات أو معلومات يقدمها
              البائع.
            </li>
            <li className="mt-3 sm:mt-4">
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
      en: "10- Insurance:",
      ar: "١٠- التأمين:",
    },
    parag: {
      en: (
        <div>
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-semibold">Insurance Payment Method:</span>
              <ul className="list-disc ml-3 sm:ml-6 mt-1">
                <li>
                  Both the seller and the bidder must pay the insurance amount
                  in the manner specified by the platform, such as:
                </li>
                <ul className="list-disc ml-3 sm:ml-6">
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
            <li className="mt-3 sm:mt-4">
              <span className="font-semibold">Insurance Percentage:</span>
              The insurance amount is displayed with each offer separately.
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">
            Procedures related to the insurance amount:
          </h3>
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-semibold">
                Confiscation of the insurance amount:
              </span>
              <ul className="list-disc ml-3 sm:ml-6 mt-1">
                <li>
                  <span className="font-semibold">For the seller:</span>
                  <ul className="list-disc ml-3 sm:ml-6">
                    <li>
                      In the event of cancellation of the auction before its
                      expiration:
                    </li>
                    <ul className="list-disc ml-3 sm:ml-6">
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
                    <ul className="list-disc ml-3 sm:ml-6">
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
                  <ul className="list-disc ml-3 sm:ml-6">
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
            <li className="mt-3 sm:mt-4">
              <span className="font-semibold">Platform Charges:</span> ALLE TRE
              platform applies only 0.5% on each successful transaction within
              the platform for each user.
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-semibold">Legal Responsibility:</span> ALLE
              TRE is not legally responsible for these violations, and legal
              action may be taken before the state courts.
            </li>
            <li className="mt-3 sm:mt-4">
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
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-semibold">طريقة دفع التأمين:</span>
              <ul className="list-disc ml-3 sm:ml-6 mt-1">
                <li>
                  يجب على البائع والمزايد دفع مبلغ التأمين بالطريقة المحددة من
                  قبل المنصة، مثل:
                </li>
                <ul className="list-disc ml-3 sm:ml-6">
                  <li>بطاقة ائتمان</li>
                  <li>نقدًا</li>
                  <li>شيك</li>
                </ul>
                <li>يتم التصرف بمبلغ التأمين وفقًا لشروط وأحكام المنصة.</li>
              </ul>
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-semibold">نسبة التأمين:</span>
              عرض مبلغ التأمين مع كل معروض بشكل منفصل .
            </li>
          </ul>

          <h3 className="text-lg font-semibold mt-6">
            الإجراءات المتعلقة بمبلغ التأمين:
          </h3>
          <ul className="list-decimal ml-3 sm:ml-6">
            <li className="mt-2 text-sm sm:text-base">
              <span className="font-semibold">مصادرة مبلغ التأمين:</span>
              <ul className="list-disc ml-3 sm:ml-6 mt-1">
                <li>
                  <span className="font-semibold">بالنسبة للبائع :</span>
                  <ul className="list-disc ml-3 sm:ml-6">
                    <li>في حالة إلغاء المزاد قبل انتهاء موعده:</li>
                    <ul className="list-disc ml-3 sm:ml-6">
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
                    <ul className="list-disc ml-3 sm:ml-6">
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
                  <ul className="list-disc ml-3 sm:ml-6">
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
            <li className="mt-3 sm:mt-4">
              <span className="font-semibold">رسوم المنصة:</span> تطبق منصة
              Alletre نسبة 0.5% فقط على كل عملية ناجحة داخل المنصة، عن كل مستخدم
              .
            </li>
            <li className="mt-3 sm:mt-4">
              <span className="font-semibold">المسؤولية القانونية:</span> لا
              تعتبر شركة ألي تري غير مسؤولة قانونًا عن هذه المخالفات، ويمكن
              اتخاذ إجراءات قانونية أمام محاكم الدولة.
            </li>
            <li className="mt-3 sm:mt-4">
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
    title: { en: "11- Security Deposit", ar: " ١١- مبلغ التأمين :" },
    parag: {
      en: (
        <div>
          <p className="mb-4">
            To protect the rights of all parties (seller and buyer) and ensure secure transactions, Alletre imposes a security deposit on certain categories of products listed for auction. The deposit amount is determined based on the type of product as follows:
          </p>
          <div className="ml-3 sm:ml-6">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">1. Electronic Products:</h3>
              <ul className="list-disc ml-4">
                <li>A security deposit of 100 AED is required for all electronic products listed in the auction (such as smartphones, computers, home appliances, etc.).</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">2. Cars:</h3>
              <ul className="list-disc ml-4">
                <li>A security deposit of 500 AED is required for cars listed in the auction.</li>
                <li>The seller must provide all legal documents related to the car, including proof of ownership and valid paperwork.</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">3. Real Estate:</h3>
              <ul className="list-disc ml-4">
                <li>A security deposit of 2% of the total property value is required, with a minimum deposit of 5000 AED.</li>
                <li>The seller must submit all legal documents confirming ownership of the property.</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">4. Antiques & Furniture:</h3>
              <ul className="list-disc ml-4">
                <li>A security deposit of 200 AED is required for antiques listed in the auction if the product value is 5000 AED or less.</li>
                <li>If the value of the antique exceeds 5000 AED, a 2% security deposit of the product's value is required.</li>
                <li>Minimum security deposit for antiques: 200 AED.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Refund of the Security Deposit:</h3>
            <ul className="list-disc ml-4">
              <li>The security deposit will be refunded after the successful completion of the transaction or upon the successful conclusion of the auction, in accordance with the terms outlined in the contract between the buyer and the seller.</li>
              <li>In case of a failed transaction, the security deposit will only be refunded if it is proven that the failure was not due to the fault or negligence of either the buyer or the seller.</li>
            </ul>
          </div>
          <div className="mt-6">
            <p className="font-semibold">Important Note:</p>
            <p>Alletre reserves the right to modify the security deposit amounts at any time at its sole discretion. All contracting parties must stay updated on any changes.</p>
          </div>
        </div>
      ),
      ar: (
        <div className="rtl">
          <p className="mb-4">
            لحماية حقوق جميع الأطراف (البائع والمشتري) وضمان سير المعاملات بشكل آمن، تفرض منصة Alletre مبلغ تأمين على بعض الفئات من المنتجات التي يتم عرضها للبيع من خلال المزادات الإلكترونية. يتم تحديد مبلغ التأمين بناءً على نوع المنتج المعروض كما يلي:
          </p>
          <div className="mr-3 sm:mr-6">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">١. المنتجات الإلكترونية:</h3>
              <ul className="list-disc mr-4">
                <li>يتم فرض مبلغ تأمين قدره 100 درهم إماراتي على جميع المنتجات الإلكترونية المعروضة في المزاد (مثل الهواتف الذكية، أجهزة الكمبيوتر، الأجهزة المنزلية، وغيرها).</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">٢. السيارات:</h3>
              <ul className="list-disc mr-4">
                <li>يتم فرض مبلغ تأمين قدره 500 درهم إماراتي على السيارات المعروضة في المزاد.</li>
                <li>يجب أن يكون البائع قد قدم كافة الأوراق القانونية المتعلقة بالسيارة، بما في ذلك ملكيتها ووثائقها الصالحة.</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">٣. العقارات:</h3>
              <ul className="list-disc mr-4">
                <li>يتم فرض مبلغ تأمين بنسبة 2% من القيمة الإجمالية للعقار المعروض للبيع في المزاد، مع حد أدنى قدره 5000 درهم إماراتي.</li>
                <li>على البائع تقديم جميع المستندات القانونية الخاصة بالعقار وتأكيد ملكيته.</li>
              </ul>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">٤. التحف والأثاث:</h3>
              <ul className="list-disc mr-4">
                <li>يتم فرض مبلغ تأمين قدره 200 درهم إماراتي على التحف المعروضة في المزاد في حال كانت قيمة المنتج 5000 درهم أو أقل.</li>
                <li>في حال كانت قيمة التحفة تتجاوز 5000 درهم إماراتي، يتم فرض مبلغ تأمين قدره 2% من قيمة المنتج.</li>
                <li>حد أدنى لمبلغ التأمين على التحف: 200 درهم إماراتي.</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold mb-2">استرداد مبلغ التأمين:</h3>
            <ul className="list-disc mr-4">
              <li>سيتم استرداد مبلغ التأمين بعد الانتهاء من المعاملة بنجاح أو في حال تم إنهاء المزاد بنجاح ووفقًا للشروط التي يتم تحديدها في العقد بين البائع والمشتري.</li>
              <li>في حال فشل المعاملة، سيُعاد مبلغ التأمين فقط في حال ثبت أن السبب لم يكن ناتجًا عن خطأ أو تقصير من طرف المشتري أو البائع.</li>
            </ul>
          </div>
          <div className="mt-6">
            <p className="font-semibold">ملاحظة هامة:</p>
            <p>يحق لمنصة Alletre تعديل مبالغ التأمين في أي وقت حسب تقديرها، ويجب على جميع الأطراف المتعاقدة متابعة التحديثات المتعلقة بذلك.</p>
          </div>
        </div>
      ),
    },
  },
  {
    title: { en: "12- Compensation", ar: " ١٢- التعويض :" },
    parag: {
      en: (
        <div className="mx-2 sm:mx-4">
          <li>
            By accepting these terms, you agree to compensate ALLE TRE for any
            claims or lawsuits arising as a result of your violation of the
            terms or your violation of any law or third party rights.
          </li>
        </div>
      ),
      ar: (
        <div className="mx-2 sm:mx-4">
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
        <div className="mx-2 sm:mx-4">
          <span className="text-lg font-bold text-gray-verydark">13-</span>
          <span>
            External links The platform may contain links to external sites.
            ALLE TRE is not responsible for the content of these links or any
            damages that may result from their use.
          </span>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">14-</span>
            <span>
              Protection of intellectual property rights ALLE TRE respects
              intellectual property rights. Please contact us if you have a
              complaint regarding intellectual property rights infringement on
              the platform.
            </span>
          </div>
        </div>
      ),
      ar: (
        <div className="mx-2 sm:mx-4">
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">١٣- </span>
            <span>
              الروابط الخارجية قد تحتوي المنصة على روابط لمواقع خارجية. لا تتحمل
              “ألي تري” مسؤولية محتوى هذه الروابط أو أي أضرار قد تنتج عن
              استخدامها.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">١٤- </span>
            <span>
              حماية حقوق الملكية الفكرية تحترم “ألي تري” حقوق الملكية الفكرية
              يُرجى التواصل معنا إذا كانت لديك شكوى تتعلق بانتهاك حقوق الملكية
              الفكرية على المنصة.
            </span>
          </div>
        </div>
      ),
    },
  },
  {
    title: { en: "", ar: "" },
    parag: {
      en: (
        <div className="ml-4 -mt-5">
          <span className="text-lg font-bold text-gray-verydark">15- </span>
          <span>
            Laws and jurisdiction These terms and conditions are subject to and
            construed in accordance with the laws of [the Emirates] . This
            country is considered the legal seat for resolving disputes.
          </span>
          <ul className="list-disc ml-3 sm:ml-6 ">
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
        <div className="ml-4 -mt-5">
          <span className="text-lg font-bold text-gray-verydark">١٥- </span>
          <span>
            القوانين والاختصاص القضائي تخضع هذه الشروط والأحكام لقوانين
            [الامارات ] وتُفسر وفقًا لها. تُعتبر هذه الدولة مقرًا قانونيًا لفض
            النزاعات.
          </span>
          <ul className="list-disc ml-3 sm:ml-6 ">
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
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-black">15- </span>
            <span>
              Value Added Tax Compliance: The ALLE TRE E-COMMERCE COMPLEX LLC
              OPC confirms that all transactions conducted through the platform
              are subject to the provisions of Federal Decree-Law No. (8) of
              2017 regarding Value Added Tax and its executive regulations, if
              the tax registration conditions apply to the seller.
              <h3 class="text-md mt-2 font-bold">
                Seller's Responsibility for Value Added Tax
              </h3>
              <ul className="mt-2 list-disc list-inside">
                <li>
                  The prices offered by the seller include value added tax.
                </li>
                <li>
                  The ALLE TRE E-COMMERCE COMPLEX LLC OPC acts as an electronic
                  intermediary to facilitate auctions between sellers and
                  buyers, and the platform does not bear any legal or financial
                  responsibility related to issuing tax invoices, collecting
                  value added tax, or any other tax obligations of sellers.
                </li>
                <li>
                  The VAT registered seller must fully comply with all
                  applicable tax laws and regulations in the United Arab
                  Emirates, including issuing correct and complete tax invoices
                  that include VAT when completing any sale through the
                  platform.
                </li>
                <li>
                  The ALLE TRE E-COMMERCE COMPLEX LLC OPC fully disclaims any
                  liability for any failure by the seller to meet its tax
                  obligations, including failure to issue tax invoices or
                  failure to collect or pay value added tax. The seller is
                  exclusively responsible for any legal or financial
                  consequences arising from non-compliance with tax laws and
                  regulations within the United Arab Emirates.
                </li>
              </ul>
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">16- </span>
            <span>
              Amendments and Notifications: ALLE TRE reserves the right to amend
              the terms and conditions at any time. You will be notified of the
              amendments via email or via a notice on the site, and your
              continued use of the site constitutes acceptance of the new terms.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">17- </span>
            <span>
              Termination of Service: ALLE TRE reserves the right to suspend or
              terminate users' accounts in the event that they violate any of
              the terms and conditions, or in the event that they behave in a
              manner that is harmful to the platform or other users.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">18- </span>
            <span>
              Electronic Communication: By using the platform, you agree to
              receive notices from ALLE TRE via email or via notices on the
              site. Any notice issued by ALLE TRE shall be considered an
              official notice.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">19- </span>
            <span>
              Headquarters: The headquarters of the company ALLE TRE is one of
              the properties of ALLE TRE E-COMMERCE COMPLEX LLC OPC.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">20- </span>
            <span>
              Inquiries: In the event of any questions or inquiries regarding
              these terms and conditions, please contact us via email under the
              title "Inquiries about the terms and conditions". Please ensure
              that you agree to these terms before starting to use the ALLE TRE
              platform.
            </span>
          </div>
        </div>
      ),
      ar: (
        <div className="ml-4 -mt-8">
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-black">١٥- </span>
            <span>
              الامتثال لضريبة القيمة المضافة: تؤكد منصة الي تري أن جميع
              المعاملات التي تتم عبر المنصة تخضع لأحكام مرسوم بقانون اتحادي رقم
              (8) لسنة 2017 بشأن ضريبة القيمة المضافة ولائحته التنفيذية، إذا
              انطبقت شروط التسجيل الضريبي على البائع.
              <h3 class="text-md mt-2 font-bold">
                مسؤولية البائع بشأن ضريبة القيمة المضافة
              </h3>
              <ul className="mt-2 list-disc list-inside">
                <li>
                  ان الأسعار المعروضة من قبل البائع تشمل ضريبة القيمة المضافة .
                </li>
                <li>
                  تعمل منصة الي تري كوسيط إلكتروني لتسهيل عمليات المزادات بين
                  البائعين والمشترين، ولا تتحمل المنصة أي مسؤولية قانونية أو
                  مالية تتعلق بإصدار الفواتير الضريبية أو تحصيل ضريبة القيمة
                  المضافة أو أي التزامات ضريبية أخرى تخص البائعين .
                </li>
                <li>
                  يتوجب على البائع المسجل في ضريبة القيمة المضافة الامتثال التام
                  لجميع القوانين واللوائح الضريبية المطبقة في الدولة الامارات
                  العربية المتحدة ، بما في ذلك إصدار فواتير ضريبية صحيحة ومكتملة
                  تشمل ضريبة القيمة المضافة عند إتمام أي عملية بيع عبر المنصة.
                </li>
                <li>
                  تخلي منصة الي تري مسؤوليتها بشكل كامل عن أي إخفاق من قِبل
                  البائع في الوفاء بالتزاماته الضريبية، بما في ذلك عدم إصدار
                  فواتير ضريبية أو التقصير في تحصيل أو سداد ضريبة القيمة
                  المضافة. ويُعتبر البائع مسؤولاً بشكل حصري عن أي عواقب قانونية
                  أو مالية تترتب على عدم الالتزام بالقوانين والأنظمة الضريبية
                  داخل دولة الامارات العربية المتحدة .
                </li>
              </ul>
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">١٦- </span>
            <span>
              التعديلات والإخطارات تحتفظ “ألي تري” بحقها في تعديل الشروط
              والأحكام في أي وقت. سيتم إخطاركم بالتعديلات عبر البريد الإلكتروني
              أو عبر إشعار على الموقع، ويُعد استمراركم في استخدام الموقع قبولًا
              للشروط الجديدة.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">١٧- </span>
            <span>
              إنهاء الخدمة تحتفظ “ألي تري” بالحق في تعليق أو إنهاء حساب
              المستخدمين في حال انتهاكهم لأي من الشروط والأحكام، أو في حال
              سلوكهم بشكل ضار بالمنصة أو المستخدمين الآخرين.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">١٨- </span>
            <span>
              التواصل الإلكتروني باستخدامكم للمنصة، فإنكم توافقون على استقبال
              الإشعارات من “ألي تري” عبر البريد الإلكتروني أو عن طريق الإشعارات
              على الموقع. يُعتبر أي إشعار صادر عن “ألي تري” بمثابة إشعار رسمي.
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">١٩- </span>
            <span>
              - مقر الشركة “ألي تري” هي من ممتلكات [ألي تري مجمع للتعامل
              الالكتروني].
            </span>
          </div>
          <div className="mt-3 sm:mt-4">
            <span className="text-lg font-bold text-gray-verydark">٢٠- </span>
            <span>
              - الاستفسارات في حال وجود أي أسئلة أو استفسارات بخصوص هذه الشروط
              والأحكام، يُرجى التواصل معنا عبر البريد الإلكتروني [ الدعم الفني و
              خدمة العملاء ] بعنوان “استفسارات حول الشروط والأحكام”. يُرجى
              التأكد من موافقتك على هذه الشروط قبل البدء في استخدام منصة “ألي
              تري.
            </span>
          </div>
        </div>
      ),
    },
  },
  {
    title: { en: "", ar: "" },
    parag: {
      en: (
        <div className="ml-4 -mt-5">
          <span className="text-lg font-bold text-gray-verydark">21- </span>
          <span>Alletre Platform Participation and Advertisement Policy</span>
          <p className="mt-2">
            Please note that posts or advertisements containing any of the
            following are not permitted in any of the Alletre Platform sections:
          </p>
          <ul className="list-disc ml-3 sm:ml-6">
            <li>
              <span className="font-semibold">Prohibited Materials</span>
              <ul className="list-disc mt-1 ml-6">
                <li>
                  Materials that violate the laws in force in the United Arab
                  Emirates or conflict with local customs, traditions, and
                  Islamic law.
                </li>
                <li>
                  Content that violates intellectual property rights, such as
                  copyrights, trademarks, or patents.
                </li>
                <li>
                  Advertisements that contain misleading, false, or incorrect
                  information.
                </li>
                <li>
                  Content that offends any individual or entity or includes
                  defamation, threats, or incitement.
                </li>
                <li>
                  Materials that contain viruses or malware that affect the
                  safety of the site or users.
                </li>
                <li>
                  Advertisements for counterfeit products or those that violate
                  trademark rights.
                </li>
              </ul>
            </li>
            <li className="mt-3">
              <span className="font-semibold">
                Acceptable Advertising Criteria
              </span>
              <ul className="list-disc mt-1 ml-6">
                <li>
                  The advertisement must be for a real product available within
                  the UAE.
                </li>
                <li>
                  Photograph the product from all angles and indicate any
                  defects.
                </li>
                <li>Photograph the purchase invoice if any.</li>
                <li>
                  Real images of the advertised product must be attached, and
                  images containing only advertising texts must not be used.
                </li>
                <li>
                  Avoid duplicating advertisements, as the previous
                  advertisement can be updated instead of publishing a new
                  advertisement.
                </li>
                <li>
                  The advertisement must comply with all the terms and
                  conditions of the "Alletre" platform, and any violation may
                  lead to the removal of the advertisement and the blocking of
                  the account.
                </li>
              </ul>
            </li>
          </ul>
          <p className="flex justify-end mt-5">
            Thank you for your cooperation.
          </p>
        </div>
      ),
      ar: (
        <div className="ml-4 -mt-5">
          <span className="text-lg font-bold text-gray-verydark">١٥- </span>
          <span>سياسة المشاركات والإعلانات في منصة "Alletre"</span>
          <p className="mt-2">
            نرجو ملاحظة أنه لا يسمح بالمشاركات أو الإعلانات التي تحتوي على أي
            مما يلي في أي من أقسام منصة "Alletre":
          </p>
          <ul className="list-disc ml-3 sm:ml-6">
            <li>
              <span className="font-semibold">المواد الممنوعة:</span>
              <ul className="list-disc mt-1 ml-6">
                <li>
                  المواد التي تخالف القوانين المعمول بها في دولة الإمارات
                  العربية المتحدة أو تتعارض مع العادات والتقاليد المحلية.
                </li>
                <li>
                  المحتوى الذي ينتهك حقوق الملكية الفكرية، مثل حقوق النشر أو
                  العلامات التجارية أو براءات الاختراع..
                </li>
                <li>
                  الإعلانات التي تحتوي على معلومات مضللة أو مزيفة أو غير صحيحة.
                </li>
                <li>
                  المحتوى الذي يسيء إلى أي فرد أو جهة أو يتضمن تشهيرًا أو
                  تهديدًا أو تحريضًا.
                </li>
                <li>
                  المواد التي تحتوي على فيروسات أو برمجيات ضارة تؤثر على سلامة
                  الموقع أو المستخدمين.
                </li>
                <li>
                  الإعلانات عن المنتجات المقلدة أو التي تنتهك حقوق العلامات
                  التجارية.
                </li>
              </ul>
            </li>
            <li className="mt-3">
              <span className="font-semibold">معايير الإعلان المقبول:</span>
              <ul className="list-disc mt-1 ml-6">
                <li>
                  يجب أن يكون الإعلان عن سلعة حقيقية ومُتاحة داخل دولة الإمارات.
                </li>
                <li> تصوير المنتج من جميع الزوايا و بيان العيوب ان وجدت .</li>
                <li> تصوير فاتورة الشراء ان وجدت .</li>
                <li>
                  يجب إرفاق صور واقعية للمنتج المُعلن عنها، وعدم استخدام صور
                  تحتوي على نصوص إعلانية فقط..
                </li>
                <li>
                  تجنب تكرار الإعلانات، حيث يمكن تحديث الإعلان السابق بدلاً من
                  نشر إعلان جديد.
                </li>
                <li>
                  يجب أن يلتزم الإعلان بجميع شروط وأحكام منصة "Alletre"، وأي
                  مخالفة قد تؤدي إلى إزالة الإعلان وحظر الحساب.
                </li>
              </ul>
            </li>
          </ul>
          <p className="flex justify-end mt-5">نشكركم على تعاونكم </p>
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
    <div className="p-4 pr-0">
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
              required={!isModalOpen}
              checked={isTermsAccepted}
              onChange={openModal}
            />
            {selectedContent[localizationKeys.iAcceptThe]}{" "}
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
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-visible"
          role="dialog"
          onClick={closeModal}
        >
          <div
            className="border-primary border-2 border-solid bg-white rounded-2xl shadow-2xl w-11/12 max-w-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 text-sm">
              <div className="flex justify-between items-center">
                <h2 className="text-black text-xl font-bold">
                  {selectedContent[localizationKeys.termsAndCondition]}
                </h2>
                <button
                  className="text-primary hover:text-red"
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
                  className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-primary border border-primary shadow hover:bg-primary-dark hover:text-white  "
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
