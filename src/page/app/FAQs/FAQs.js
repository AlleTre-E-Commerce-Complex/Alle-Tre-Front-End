import React, { useState } from "react";
import { FAQsBreadcrumb } from "../../../component/shared/bread-crumb/Breadcrumb";
import { TiArrowSortedDown } from "react-icons/ti";
import { motion } from "framer-motion";
import { useLanguage } from "../../../context/language-context";
import { useEffect } from "react";

const FQAsDate = [
  {
    title: { en: "Tariffs :", ar: "التعريفات :" },
    parag: {
      en: (
        <div>
          <li>Website : www.alletre.com</li>
          <li>
            Owner : AlleTre E-commerce complex LLC, a limited liability company
            located in Ras Al Khaima - United Arab Emirates.
          </li>
          <li>
            User : Anyone who accesses the Atri website, whether for the purpose
            of viewing, selling, bidding, or buying without limitation.
          </li>
          <li>
            Bidder : Anyone who offers a commodity or service on the site,
            whether by way of auction or direct sale.
          </li>
          <li>
            Offered : The commodity or service that is displayed on the site,
            whether by way of auction or direct sale.
          </li>
          <li>
            Bidder : Anyone who submits a financial offer to purchase the
            offered item.
          </li>
          <li>
            Highest Bid : The highest bidder in the auction after the end of the
            offer period.
          </li>
          <li>
            Second bid : The person with the second highest bid in the auction
            after the end of the offer period.
          </li>
          <li>
            Offer Period : The period during which the bidder offers the good or
            service in the auction.
          </li>
        </div>
      ),
      ar: (
        <div>
          <li>الموقع : موقع www.alletre.com</li>
          <li>
            المالك : شركة الاتري ذ م م شركة ذات مسؤولية محدودة مقرها رأس الخيمة
            – دولة الامارات العربية المتحدة.
          </li>
          <li>
            المستخدم: كل من يدخل الى موقع الاتري سواء لغرض المشاهدة أو البيع أو
            المزايدة أو الشراء دون حصر.
          </li>
          <li>
            العارض: كل من يقوم بعرض سلعة أو خدمة على الموقع سواء بطريقة المزاد
            أو البيع المباشر.
          </li>
          <li>
            المعروض: السلعة أو الخدمة التي يتم عرضها على الموقع سواء بطريقة
            المزاد أو البيع المباشر.
          </li>
          <li>المزايد: كل من يقوم بتقديم عرض مالي لشراء المعروض.</li>
          <li>اعلى عرض: صاحب أعلى عرض في المزاد بعد انتهاء فترة العرض.</li>
          <li>ثاني عرض: صاحب ثاني أعلى عرض في المزاد بعد انتهاء فترة العرض.</li>
          <li>
            فترة العرض: الفترة التي يعرض فيها العارض السلعة أو الخدمة في المزاد.
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "The Introduction :", ar: "المقدمة :" },
    parag: {
      en: (
        <div>
          <li>
            This user agreement is considered an agreement between any user who
            enters the site and the owner, and once the user enters the site,
            this agreement applies to him implicitly and is considered as
            acceptance of its terms implicitly without the condition of signing,
            and in the event of violation of these clauses, resort to
            arbitration mentioned in the items below or to the judicial
            authorities appropriate according to the facts.
          </li>
          <li>
            Entering the site constitutes acceptance of the aforementioned
            arbitration agreement, and approval that the site or whoever is
            appointed by the site be an arbitrator between the parties to the
            dispute.
          </li>
          <li>
            All users agree that the site is not responsible for the misuse of
            the features mentioned in it, and no party has the right to file any
            contractual or tort liability suit for the misuse of the site by
            other parties, as it is considered an open market for all, and the
            site assumes the good faith of all registered on the site.
          </li>
          <li>
            In the event that any suspicious behavior or any attempt to commit a
            crime is noticed by the users of the site, those who notice this
            must inform the competent security authorities.
          </li>
        </div>
      ),
      ar: (
        <div>
          <li>
            تعتبر اتفاقية المستخدم هذه بمثابة اتفاق بين أي مستخدم يدخل للموقع
            وبين المالك، وبمجرد دخول المستخدم على الموقع تنطبق عليه هذه
            الاتفاقية ضمنيا وتعتبر بمثابة الموافقة على شروطها ضمنيا دون شرط
            التوقيع، وفي حالة مخالفة هذه البنود سيتم اللجوء إلى التحكيم المذكور
            في البنود أدناه أو للجهات القضائية المختصة وفقا للواقعه.
          </li>
          <li>
            يعتبر الدخول إلى الموقع بمثابة الموافقة على اتفاق التحكيم المذكور،
            وموافقة على أن يكون الموقع أو من يعينه الموقع محكما بين أطراف
            النزاع.
          </li>
          <li>
            يوافق جميع المستخدمين على أن الموقع غير مسؤول عن سوء استخدام للخصائص
            المذكورة فيه، ولا يحق لأي طرف رفع أي دعوى مسؤولية تعاقدية أو تقصيرية
            عن اساءة استخدام الموقع من الأطراف الاخرى، حيث أنه يعتبر بمثابة سوق
            مفتوح للجميع، ويفترض الموقع حسن النية عند جميع المسجلين بالموقع.
          </li>
          <li>
            في حالة ملاحظة أي تصرف مشبوه أو اي شروع لارتكاب الجريمة من قبل
            مستخدمي الموقع يتوجب على من يلاحظ ذلك تبليغ الجهات الأمنية المختصة.
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "First: About The Site :", ar: " أولا : عن الموقع : " },
    parag: {
      en: (
        <li>
          The site is an interface for the use of those who wish to surf the
          World Wide Web, whether from the owners of goods and owners of
          services (the government agency, the trader or the natural person), in
          order to display it on the electronic auction method. to the highest
          bidder in the auction.
        </li>
      ),
      ar: (
        <li>
          الموقع هو واجهة لاستخدام من يرغب من متصفحي الشبكة العنكبوتية سواء من
          ملاك السلع وأصحاب الخدمات (الجهة الحكومية أو التاجر أو الشخص الطبيعي)
          وذلك للعرض على طريقة المزاد العلني الاليكتروني، يقوم من يرغب بالمزايدة
          على المعروض وذلك وفقاً لشروط الموقع وذلك بهدف نقل ملكية المعروض من
          العارض إلى صاحب أعلى عرض في المزاد.
        </li>
      ),
    },
  },
  {
    title: {
      en: "Second: How The Site Works:",
      ar: "ثانياً : طريقة عمل الموقع : ",
    },
    parag: {
      en: (
        <div>
          <li>
            The site is available to all internet users for viewing and
            follow-up in all categories, but if the viewer wants to view or bid
            on the commodity, he must register.
          </li>
          <li>
            Each user who wishes to register must provide correct and clear
            information about himself, in order to avoid any future errors in
            the offer process, receiving money, or handing over and transferring
            ownership of the offer to the buyer.
          </li>
          <li>
            After completing the registration process, the user has the right to
            offer or bid.
          </li>
          <li>
            Presentation : The user records the exhibit data sufficiently and
            provides correct data for the exhibit, then uploads the photos of
            the exhibit, then signs the site usage agreement and pays the fee
            specified for the offer.
          </li>
          <li>
            Bidding: The user enters the bidding process after paying the
            insurance specified by the site to bid on the commodity.
          </li>
          <li>
            The auction shall be awarded to the owner of the highest bid
            submitted on the commodity, and after approval of the offer, the
            owner of the above must offer to pay the amount required of him
            during the period that is specified at the time of communication
            with him by the site.
          </li>
          <li>
            The buyer determines the method of receiving and examining the
            offered item through shipping companies or through personal receipt.
          </li>
          <li>
            In the event that the bidder fails to transfer the ownership of the
            offered item to the buyer, or if there is a material defect in the
            offered item, a fine will be applied to the bidder, and the item
            will be removed from the list and the bidder's account will be
            frozen until further notice.
          </li>
          <li>
            In the event that the buyer fails to pay the value of the offer, a
            fine will be applied to the buyer, part of which will be paid to the
            site and the other part to the seller as compensation.
          </li>
          <li>
            In the event of a dispute between the seller and the buyer over the
            offered commodity, the two parties shall submit evidence of their
            claim to the site, and the representative of the site shall play the
            role of arbitration between the two parties according to the terms
            and fees that are agreed upon.
          </li>
        </div>
      ),
      ar: (
        <div>
          <li>
            الموقع متاح لجميع مستخدمي الانترنت للمشاهدة والمتابعة وذلك في جميع
            التصنيفات، ولكن في حالة رغبة المشاهد عرض السلعة أو المزايدة عليها
            يتوجب عليه التسجيل.
          </li>
          <li>
            يجب على كل مستخدم يرغب بالتسجيل تقديم معلومات صحيحة وواضحة عن نفسه،
            وذلك لتفادي أي اخطاء مستقبلية في عملية العرض أو استلام الأموال أو
            تسليم ونقل ملكية المعروض للمشتري.
          </li>
          <li>بعد اكتمال عملية التسجيل يحق للمستخدم العرض أو المزايدة.</li>
          <li>
            العرض : يقوم المستخدم بتسجيل بيانات المعروض بشكل كاف وتقديم بيانات
            سليمة للمعروض، ومن ثم رفع الصور الخاصة بالمعروض، ثم التوقيع على
            اتفاقية استخدام الموقع ودفع الرسم المحدد للعرض.
          </li>
          <li>
            المزايدة: يدخل المستخدم عملية المزايدة وذلك بعد أن يقوم بدفع التأمين
            المحدد من الموقع للمزايدة على السلعة.
          </li>
          <li>
            يرسو المزاد على صاحب أعلى عرض تم تقديمه على السلعة، وبعد الموافقة
            على العرض يتوجب على صاحب أعلاه عرض دفع المبلغ المطلوب منه خلال
            الفترة التي يتم تحديدها وقت التواصل معه من قبل الموقع.
          </li>
          <li>
            يقوم المشتري بتحديد طريقة استلامه للمعروض وفحصه عن طريق شركات الشحن
            أو عن طريق الاستلام الشخصي.
          </li>
          <li>
            في حالة فشل العارض بنقل ملكية المعروض إلى المشتري أو في حالة وجود
            عيب جوهري في المعروض تطبق غرامة مالية على العارض ويتم حذف السلعة من
            القائمة وتجميد حساب العارض حتى اشعار آخر.
          </li>
          <li>
            في حالة فشل المشتري بدفع قيمة المعروض يتم تطبيق غرامة مالية على
            المشتري يدفع جزء منها إلى الموقع والجزء الاخر إلى البائع كتعويض.
          </li>
          <li>
            في حالة وجود خلاف بين البائع والمشتري على السلعة المعروضه يقدم
            الطرفين ما يفيد ادعاءهم للموقع ويقوم ممثل الموقع بدورالتحكيم بين
            الطرفين وفقاً للشروط والرسوم التي يتم الاتفاق عليها ويعتبر حكم
            التحكيم الصادر حكماً نهائيا لا يمكن الطعن عليه بأي من طرق الطعن.
          </li>
        </div>
      ),
    },
  },
  {
    title: { en: "Third: General Provisions :", ar: "ثالثا : احكام عامة :" },
    parag: {
      en: (
        <div>
          <li>
            The owner is not a party to the contract between the seller and the
            buyer, and it is not permissible to sue him or his workers,
            managers, or any of his partners for any matter related to the
            offered item, its specifications, or its ownership, whether from a
            formal or material aspect.
          </li>
          <li>
            The relationship between the site's users has been organized so that
            a fine will be imposed on any person who does not abide by the terms
            of the auction. The value of this financial fine will be shared in a
            manner determined by the owner, and the proceeds will be distributed
            between the affected person and the owner of the site.
          </li>
          <li>
            The seller can offer any commodity he wishes to sell, whether for
            the purpose of making a profit or for the purpose of disposing of
            it, in order to obtain the financial consideration from the buyer
            and transfer the ownership of the offered to the buyer, but the
            user, in the event that his commodity is offered, must pay the
            insurance amount to ensure that he adheres to the terms of the
            auction, and in the event If he fails to comply with the terms of
            the auction, a fine will be imposed to be deducted from the
            insurance value.
          </li>
          <li>
            The buyer can bid on any of the commodities offered on the site,
            provided that he adheres to the insurance conditions.
          </li>
          <li>
            The user registers on the site and agrees to the site usage
            agreement, and undertakes that all the data he entered is correct at
            his personal responsibility.
          </li>
          <li>
            Any attempt to disable or hack the site will be reported to the
            authorities about this attempt, and the owner is entitled to a civil
            compensation amount starting from 500,000 AED in contrast to the
            fines specified by the competent judicial authorities.
          </li>
          <li>
            Any use by the User of fraudulent or fraudulent payment cards,
            Clause 5 above will be applied and the Owner shall be entitled to
            the same compensation mentioned above.
          </li>
          <li>
            The use of fake or unreal goods for the purpose of financial gain is
            considered fraud and is subject to the discretion of the security
            authorities and referral to the penal laws of the competent
            authority.
          </li>
          <li>
            All transactions are made in US dollars and the owner is not
            responsible for any loss resulting from the exchange rate change
            resulting from the conversion between currencies.
          </li>
          <li>
            In the event that the user photographed the exhibit, the site is not
            responsible for any difference between the images and the reality,
            and the user is personally responsible for that difference.
          </li>
          <li>
            Possession in the movable is a title deed, but the user tries, as
            much as possible, to present what proves his ownership of the
            commodities, such as invoices or others, and in the event that the
            buyer is not satisfied with the title deed upon receipt, he has the
            right not to receive the offer and asks the site not to pay the
            price until he submits what makes him reassured of the validity of
            ownership Or the matter is raised for arbitration through the site.
          </li>
          <li>
            Value Added Tax will be added in accordance with Federal Tax
            Authority (FTA) Law No. 8/2017 issued by the Government of the
            United Arab Emirates on all services provided by the website that
            are subject to tax.
          </li>
          <li>
            The right to use all names, trademarks, service names and marks,
            names of holdings, logos and images belongs to the owners of the
            site alone.
          </li>
        </div>
      ),
      ar: (
        <div>
          <li>
            المالك ليس طرفاً في العقد بين البائع والمشتري ولا يجوز اختصامه أو
            اختصام عامليه أو مدرائه أو أياً من شركائه لأي أمر يتعلق بالمعروض أو
            بمواصفاته أو ملكيته سواء من الناحية الشكلية أو من الناحية المادية.
          </li>
          <li>
            تم تنظيم العلاقة بين مستخدمي الموقع بحيث يتم ايقاع غرامة مالية على
            أي شخص غير ملتزم بشروط المزاد، يتم اقتسام قيمة هذه الغرامة المالية
            بطريقة يحددها المالك، ويتم توزيع المحصلة بين الشخص المتضرر وبين مالك
            الموقع.
          </li>
          <li>
            يمكن للبائع عرض أي سلعة يرغب في بيعها سواء كانت بغرض التربح أو بغرض
            التخلص منها ، وذلك للحصول على المقابل المالي من المشتري ونقل ملكية
            المعروض إلى الشاري، ولكن يجب على المستخدم في حالة عرض سلعته دفع
            المبلغ التأمين للتأكد التزامه بشروط المزاد، وفي حال عدم التزامه
            بشروط المزاد سيتم فرض غرامة مالية تخصم من قيمة التأمين.
          </li>
          <li>
            يمكن للمشتري المزايدة على أي من السلع المعروضه بالموقع بشرط التزامه
            بشروط التأمين، وفي حال رسو المزاد عليه وتخلفه عن السداد سيتم فرض
            غرامة مالية عليه تخصم بالطريقة التي يحددها الموقع.
          </li>
          <li>
            يقوم المستخدم بالتسجيل على الموقع وبالموافقة على اتفاقية استخدام
            الموقع، ويتعهد بأن جميع البيانات التي قام بإدخالها صحيحه على
            مسؤوليته الشخصية.
          </li>
          <li>
            أي محاولة لتعطيل أو اختراق الموقع سيتم ابلاغ السلطات عن هذه
            المحاولة، ويستحق المالك مبلغ تعويض مدني يبدأ من 500000 درهم إماراتي
            خلافاً عن الغرامات المحددة من الجهات القضائية المختصة.
          </li>
          <li>
            أي استخدام من المستخدم لبطاقات دفع مزورة أو غير حقيقة سيتم تطبيق
            الفقرة 5 أعلاه ويستحق المالك ذات التعويض المذكور أعلاه.
          </li>
          <li>
            استخدام السلع الوهمية أو غير الحقيقة بغرض التكسب المادي يعتبر بمثابة
            الاحتيال وخاضع لتقدير الجهات الأمنية والاحالة إلى القوانين الجزائية
            للسلطة المختصة.
          </li>
          <li>
            جميع المعاملات تتم بالدولار الأمريكي والمالك غير مسؤول عن أي خسارة
            ناتجة عن تغير سعر الصرف الناتج عن التحويل بين العملات.
          </li>
          <li>
            في حالة قيام المستخدم بتصوير المعروض فإن الموقع غير مسؤول عن أي
            اختلاف بين الصور وبين الواقع، ويتم تحميل المستخدم شخصياً المسؤولية
            على ذلك الاختلاف.
          </li>
          <li>
            الحيازة في المنقول سند للملكية، ولكن يحاول المستخدم قدر المستطاع
            تقديم ما يفيد ملكيته للسلع من فواتير أو غيره، وفي حالة عدم اقتناع
            المشتري بسند الملكية عند الاستلام يحق له عدم استلام المعروض ويطلب من
            الموقع عدم سداد الثمن حتى تقديم ما يجعله يطمئن بصحة الملكية، أو يتم
            رفع الموضوع للتحكيم عن طريق الموقع.
          </li>
          <li>
            سيتم إضافة ضريبة القيمة المضافة وفقاً لقانون الهيئة الإتحادية
            للضرائب (FTA) رقم 2017/8 الصادر عن حكومة دولة الإمارات العربية
            المتحدة على جميع الخدمات المقدمة من الموقع والتي تخضع للضريبة.
          </li>
          <li>
            يعود حق استخدام كافة الأسماء والعلامات التجارية وأسماء وعلامات
            الخدمات وأسماء المقتنيات والشعارات والصور لأصحاب الموقع وحدهم.
          </li>
        </div>
      ),
    },
  },
  {
    title: {
      en: "Applicable Law and Jurisdiction :",
      ar: " القانون المعمول به والولاية القضائية : ",
    },
    parag: {
      en: (
        <div>
          <li>
            These terms and conditions shall be governed by and construed in
            accordance with the laws and federal laws of the United
            Arab Emirates. Any dispute arising out of or in connection with
            these terms and conditions, the parties shall resort to resolve the
            dispute through arbitration.
          </li>
        </div>
      ),
      ar: (
        <div>
          <li>
            قانون دولة الإمارات العربية المتحدة, و أي نزاع ينشأ عن أو فيما يتعلق
            بهذه الشروط والأحكام ، يلجأ الأطراف لحل النزاع عن طريق التحكيم.
          </li>
        </div>
      ),
    },
  },
];

const FAQs = () => {
  const [lang] = useLanguage("");
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mt-44 max-w-[1440px] mx-auto">
      <FAQsBreadcrumb />
      <div className="pt-9">
        {FQAsDate.map((e) => (
          <MotionRow Title={e?.title[lang]} parag={e?.parag[lang]} />
        ))}
      </div>
    </div>
  );
};

export const MotionRow = ({ Title, parag }) => {
  const [onClick, setOnclick] = useState(true);

  return (
    <div className="py-2.5 mx-4">
      <motion.div
        onClick={() => setOnclick((p) => !p)}
        className={`overflow-hidden border-veryLight border-[1px] rounded-lg px-8 cursor-pointer`}
        initial={{ height: "44px" }}
        animate={{ height: onClick ? "44px" : "auto" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-between">
          <h1 className="text-gray-dark font-normal text-base py-3">{Title}</h1>
          <TiArrowSortedDown
            className={`${
              onClick
                ? "origin-center -rotate-90 duration-200 delay-200"
                : "origin-center duration-200 delay-200"
            } text-gray-med mt-2 `}
            size={23}
          />
        </div>
        <p className="text-gray-med font-normal text-base pt-3 pb-10 ">
          {parag}
        </p>
      </motion.div>
    </div>
  );
};

export default FAQs;
