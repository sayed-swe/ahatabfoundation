// English and Bangla for every fixed piece of text. Editable content (programs, stories,
// events) carries its own *_en / *_bn columns in the database.

const KEY = "ahatab-lang";
const dict = {
  en: {
    "skip": "Skip to content",
    "nav.news": "News",
    "nav.volunteer": "Volunteer",
    "nav.close": "Close menu",
    "meta.news": "News and stories | Ahatab Foundation",
    "meta.donate": "Donate | Ahatab Foundation",
    "meta.volunteer": "Volunteer | Ahatab Foundation",
    "donate.title": "Donate",
    "donate.lede": "Give in a few taps from your phone. Your gift helps families in Faridpur with food, care and shelter.",
    "donate.s1": "Amount",
    "donate.s2": "Method",
    "donate.s3": "Send",
    "donate.amount.title": "How much would you like to give?",
    "donate.amount.other": "Other amount",
    "donate.amount.min": "Please enter an amount of ৳10 or more.",
    "donate.name.required": "Please enter your name, or choose to give anonymously.",
    "donate.anon": "Give anonymously",
    "donate.next": "Continue",
    "donate.back": "Back",
    "donate.method.title": "Choose how to pay",
    "donate.method.group": "Mobile banking",
    "donate.method.empty": "Payment numbers are being set up. Please contact us and we will tell you how to give today.",
    "donate.method.contact": "Contact us",
    "donate.pay": "Pay ৳{a}",
    "donate.to": "Please send money to this number",
    "donate.copy": "Copy",
    "donate.copied": "Copied",
    "donate.amount.label": "Amount to send",
    "donate.timer": "Time left",
    "donate.timer.over": "The timer has ended. If you already sent your gift, you can still enter the Transaction ID below.",
    "donate.how": "How to send",
    "donate.step.1": "Open your {m} app or dial its USSD code.",
    "donate.step.2": "Choose {t} and send ৳{a} to the number above.",
    "donate.step.3": "Copy the Transaction ID from the confirmation message and enter it below.",
    "donate.trx.label": "Transaction ID",
    "donate.trx.ph": "For example 9HK3L2M4NP",
    "donate.trx.submit": "Submit Transaction ID",
    "donate.trx.invalid": "Enter the Transaction ID exactly as in your message: letters and numbers, 6 to 24 characters.",
    "donate.trx.dupe": "This Transaction ID was already submitted. If you think this is a mistake, please contact us.",
    "donate.thanks.title": "Thank you!",
    "donate.thanks.body": "We have received your Transaction ID. Our team will check it and confirm your gift soon.",
    "donate.thanks.again": "Give again",
    "donate.thanks.home": "Back to home",
    "donate.safe": "Never share your PIN or OTP with anyone. We will never ask for it.",
    "donate.honest": "We confirm every gift by hand against our account, so your gift shows as confirmed after our team checks it.",
    "donate.optional.phone": "Phone (optional)",
    "donate.optional.msg": "Message (optional)",
    "donate.summary": "Your gift",
    "donate.type.default": "Send Money",
    "nav.events": "Events",
    "meta.events": "Events | Ahatab Foundation",
    "events.h1": "Events",
    "events.lede": "Drives, camps and workshops. Come to help, or just to say hello.",
    "events.past": "Past events",
    "events.all": "All events",
    "cat.issue": "The problem",
    "why.title": "Why this work matters",
    "why.sub": "Floods, rising prices and unsafe water hit the same families again and again. These are the problems we are working on.",
    "common.sample": "Sample",
    "nav.home": "Home",
    "nav.about": "About us",
    "nav.programs": "What we do",
    "nav.stories": "News",
    "nav.involved": "Get involved",
    "nav.contact": "Contact",
    "nav.donate": "Donate",
    "nav.menu": "Menu",
    "lang.aria": "Switch language",
    "lang.other": "বাংলা",

    "meta.home": "Ahatab Foundation, Faridpur",
    "meta.about": "About us | Ahatab Foundation",
    "meta.programs": "What we do | Ahatab Foundation",
    "meta.stories": "News and stories | Ahatab Foundation",
    "meta.involved": "Get involved | Ahatab Foundation",
    "meta.contact": "Contact | Ahatab Foundation",

    "hero.title": "Extending hands to those who need it most.",
    "hero.lede": "Ahatab Foundation is a new, community-rooted charity in Faridpur, Bangladesh. We work to bring food, care and opportunity to families who are too often overlooked.",
    "hero.cta.programs": "See what we do",
    "hero.cta.donate": "Donate",

    "intro.title": "Small acts of help add up.",
    "intro.body": "Ahatab Foundation began in 2026 to honour a grandfather's kindness. We hold one belief close: when neighbours look after neighbours, nobody is left behind.",
    "intro.link": "Read our story",
    "feed.title": "Every meal, every book, every checkup.",
    "feed.body": "Gifts go straight into the programs listed above, and our team checks and confirms each gift before we count it.",
    "feed.cta": "Give a gift",

    "programs.title": "What we do",
    "programs.sub": "We start by meeting basic human needs, then open doors to a better future.",
    "programs.all": "See all programs",
    "common.readMore": "Read more",
    "common.readStory": "Read story",
    "common.empty.programs": "Programs will be listed here soon.",
    "common.empty.stories": "No stories yet. Check back soon.",
    "common.empty.events": "No upcoming events right now.",
    "common.loadError": "We couldn't load this right now. Please refresh the page.",
    "common.back": "Back to all stories",
    "common.notFound": "We couldn't find that story.",

    "impact.title": "Our impact so far",
    "impact.people": "People helped",
    "impact.families": "Families supported",
    "impact.volunteers": "Volunteers",
    "impact.projects": "Projects completed",

    "stories.title": "Latest news",
    "stories.all": "All stories",
    "events.title": "Coming up",

    "cta.title": "Help us reach one more family.",
    "cta.donate": "Donate",
    "cta.volunteer": "Volunteer",

    "footer.explore": "Explore",
    "footer.contact": "Contact",
    "footer.rights": "© 2026 Ahatab Foundation. All rights reserved.",
    "footer.admin": "Admin",
    "footer.pending": "Contact details will be added soon.",

    "about.title": "About us",
    "about.lede": "A new foundation with an old idea: look after the people next to you.",
    "about.story.title": "Why we started",
    "about.story.p1": "Ahatab Foundation was founded in 2026 in Faridpur, Bangladesh. It exists to honour the ideals and compassion of our dada, and to carry that legacy forward through service.",
    "about.story.p2": "We believe a small act of help can have a large effect, and that a society is only as strong as its care for the people who have the least.",
    "about.mission.title": "Our mission",
    "about.mission.body": "To extend a helping hand to the people in greatest need.",
    "about.approach.title": "How we work",
    "about.approach.1": "Meet basic needs first: food, health, water and shelter.",
    "about.approach.2": "Open doors to a better future through education and opportunity.",
    "about.approach.3": "Build an inclusive society where no one is left behind.",
    "about.values.title": "What we stand for",
    "about.v1.t": "Compassion",
    "about.v1.d": "We start by listening and showing up.",
    "about.v2.t": "Dignity",
    "about.v2.d": "Help should never make someone feel smaller.",
    "about.v3.t": "Inclusion",
    "about.v3.d": "Everyone in need is welcome, whatever their background.",
    "about.v4.t": "Accountability",
    "about.v4.d": "We will share how every gift is used.",
    "about.where.title": "Where we work",
    "about.where.body": "We are based in Faridpur and begin with the communities around us.",

    "stories.page.title": "News and stories",
    "stories.page.lede": "Updates from our work, in our own words.",
    "events.page.title": "Upcoming events",
    "cat.news": "News",
    "cat.update": "Update",
    "cat.story": "Story",

    "involved.title": "Get involved",
    "involved.lede": "Give money, give time, or tell someone about us. All three help.",
    "give.title": "Give",
    "give.none": "Our payment details are being set up. Contact us and we will tell you how to give today.",
    "give.step": "After you send your gift, tell us about it here so we can confirm it and thank you.",
    "give.form.title": "Tell us about your gift",
    "give.note": "This form records your gift. It does not send money.",
    "give.submit": "Record my gift",
    "give.thanks": "Thank you. We have your details and will confirm your gift soon.",
    "form.name": "Your name",
    "form.phone": "Phone",
    "form.email": "Email",
    "form.optional": "(optional)",
    "form.amount": "Amount (BDT)",
    "form.method": "Payment method",
    "form.method.other": "Other",
    "form.trx": "Transaction ID",
    "form.message": "Message",
    "form.subject": "Subject",
    "form.sending": "Sending…",
    "form.error": "That didn't send. Check your details and try again.",
    "vol.title": "Volunteer",
    "vol.lede": "Tell us how you'd like to help and we will call you.",
    "vol.area": "Where could you help?",
    "vol.a.logistics": "Distribution and logistics",
    "vol.a.health": "Health and first aid",
    "vol.a.teaching": "Teaching and mentoring",
    "vol.a.fund": "Fundraising",
    "vol.a.media": "Photos, video and design",
    "vol.a.other": "Something else",
    "vol.submit": "Offer to volunteer",
    "vol.thanks": "Thank you for offering your time. We will call you soon.",
    "spread.title": "Spread the word",
    "spread.body": "Share this page with a friend or family member. Everyone who hears about us is one more pair of hands.",
    "share.copy": "Copy link",
    "share.copied": "Link copied",

    "contact.title": "Contact",
    "contact.lede": "Questions, ideas, or a family we should know about? Write to us.",
    "contact.form.title": "Send a message",
    "contact.submit": "Send message",
    "contact.thanks": "Thanks. We got your message and will reply soon.",
    "contact.info": "Find us",
    "contact.location": "Location",
  },
  bn: {
    "skip": "মূল অংশে যান",
    "nav.news": "খবর",
    "nav.volunteer": "স্বেচ্ছাসেবক",
    "nav.close": "মেনু বন্ধ করুন",
    "meta.news": "খবর ও গল্প | আহতাব ফাউন্ডেশন",
    "meta.donate": "অনুদান দিন | আহতাব ফাউন্ডেশন",
    "meta.volunteer": "স্বেচ্ছাসেবক হোন | আহতাব ফাউন্ডেশন",
    "donate.title": "অনুদান দিন",
    "donate.lede": "ফোন থেকে কয়েকটি ট্যাপেই অনুদান দিন। আপনার দান ফরিদপুরের পরিবারগুলোর খাবার, যত্ন ও আশ্রয়ে কাজে লাগবে।",
    "donate.s1": "পরিমাণ",
    "donate.s2": "মাধ্যম",
    "donate.s3": "পাঠান",
    "donate.amount.title": "কত টাকা দিতে চান?",
    "donate.amount.other": "অন্য পরিমাণ",
    "donate.amount.min": "অন্তত ৳১০ বা তার বেশি লিখুন।",
    "donate.name.required": "আপনার নাম লিখুন, অথবা নাম গোপন রাখুন।",
    "donate.anon": "নাম গোপন রাখুন",
    "donate.next": "পরবর্তী ধাপ",
    "donate.back": "পিছনে",
    "donate.method.title": "কীভাবে পাঠাবেন বেছে নিন",
    "donate.method.group": "মোবাইল ব্যাংকিং",
    "donate.method.empty": "পেমেন্টের নম্বর প্রস্তুত করা হচ্ছে। যোগাযোগ করুন, আজই কীভাবে দেবেন আমরা জানিয়ে দেব।",
    "donate.method.contact": "যোগাযোগ করুন",
    "donate.pay": "৳{a} পাঠান",
    "donate.to": "অনুগ্রহ করে নিচের নম্বরে সেন্ড মানি করুন",
    "donate.copy": "কপি",
    "donate.copied": "কপি হয়েছে",
    "donate.amount.label": "যে পরিমাণ পাঠাবেন",
    "donate.timer": "সময় বাকি",
    "donate.timer.over": "সময় শেষ হয়েছে। আপনি আগেই টাকা পাঠিয়ে থাকলে নিচে ট্রানজ্যাকশন আইডি দিতে পারবেন।",
    "donate.how": "কীভাবে পাঠাবেন",
    "donate.step.1": "আপনার {m} অ্যাপ অথবা ইউএসএসডি কোড ব্যবহার করুন।",
    "donate.step.2": "{t} বেছে নিয়ে উপরের নম্বরে ৳{a} পাঠান।",
    "donate.step.3": "নিশ্চিতকরণ বার্তা থেকে ট্রানজ্যাকশন আইডি কপি করে নিচে লিখুন।",
    "donate.trx.label": "ট্রানজ্যাকশন আইডি",
    "donate.trx.ph": "যেমন 9HK3L2M4NP",
    "donate.trx.submit": "ট্রানজ্যাকশন আইডি জমা দিন",
    "donate.trx.invalid": "বার্তায় যেমন আছে ঠিক তেমন লিখুন: ইংরেজি অক্ষর ও সংখ্যা, ৬ থেকে ২৪ অক্ষর।",
    "donate.trx.dupe": "এই ট্রানজ্যাকশন আইডি আগেই জমা হয়েছে। ভুল মনে হলে আমাদের সাথে যোগাযোগ করুন।",
    "donate.thanks.title": "ধন্যবাদ!",
    "donate.thanks.body": "আপনার ট্রানজ্যাকশন আইডি পেয়েছি। আমাদের দল যাচাই করে শীঘ্রই আপনার অনুদান নিশ্চিত করবে।",
    "donate.thanks.again": "আবার অনুদান দিন",
    "donate.thanks.home": "হোমে ফিরুন",
    "donate.safe": "আপনার পিন বা ওটিপি কাউকে দেবেন না। আমরা কখনো তা চাইব না।",
    "donate.honest": "প্রতিটি অনুদান আমরা নিজেদের অ্যাকাউন্টের সাথে মিলিয়ে নিশ্চিত করি, তাই যাচাইয়ের পর আপনার অনুদান নিশ্চিত দেখাবে।",
    "donate.optional.phone": "ফোন (ঐচ্ছিক)",
    "donate.optional.msg": "বার্তা (ঐচ্ছিক)",
    "donate.summary": "আপনার অনুদান",
    "donate.type.default": "সেন্ড মানি",
    "nav.events": "আয়োজন",
    "meta.events": "আয়োজন | আহতাব ফাউন্ডেশন",
    "events.h1": "আয়োজন",
    "events.lede": "ত্রাণ বিতরণ, ক্যাম্প ও কর্মশালা। সাহায্য করতে আসুন, কিংবা শুধু দেখা করে যান।",
    "events.past": "অতীত আয়োজন",
    "events.all": "সব আয়োজন",
    "cat.issue": "সমস্যা",
    "why.title": "কেন এই কাজ জরুরি",
    "why.sub": "বন্যা, জিনিসপত্রের দাম বাড়া আর অনিরাপদ পানি বারবার একই পরিবারগুলোকে আঘাত করে। এই সমস্যাগুলো নিয়েই আমরা কাজ করছি।",
    "common.sample": "নমুনা",
    "nav.home": "হোম",
    "nav.about": "আমাদের কথা",
    "nav.programs": "আমাদের কাজ",
    "nav.stories": "খবর",
    "nav.involved": "পাশে দাঁড়ান",
    "nav.contact": "যোগাযোগ",
    "nav.donate": "অনুদান দিন",
    "nav.menu": "মেনু",
    "lang.aria": "ভাষা পরিবর্তন করুন",
    "lang.other": "English",

    "meta.home": "আহতাব ফাউন্ডেশন, ফরিদপুর",
    "meta.about": "আমাদের কথা | আহতাব ফাউন্ডেশন",
    "meta.programs": "আমাদের কাজ | আহতাব ফাউন্ডেশন",
    "meta.stories": "খবর ও গল্প | আহতাব ফাউন্ডেশন",
    "meta.involved": "পাশে দাঁড়ান | আহতাব ফাউন্ডেশন",
    "meta.contact": "যোগাযোগ | আহতাব ফাউন্ডেশন",

    "hero.title": "যাদের সবচেয়ে বেশি প্রয়োজন, তাদের দিকে সাহায্যের হাত বাড়িয়ে দেওয়া।",
    "hero.lede": "আহতাব ফাউন্ডেশন ফরিদপুরের একটি নতুন, সমাজভিত্তিক দাতব্য উদ্যোগ। যে পরিবারগুলো প্রায়ই অবহেলিত থেকে যায়, তাদের কাছে খাদ্য, সেবা ও সুযোগ পৌঁছে দিতে আমরা কাজ করছি।",
    "hero.cta.programs": "আমাদের কাজ দেখুন",
    "hero.cta.donate": "অনুদান দিন",

    "intro.title": "ছোট ছোট সাহায্য মিলেই বড় পরিবর্তন।",
    "intro.body": "একজন দাদার মানবিকতাকে সম্মান জানাতে ২০২৬ সালে আহতাব ফাউন্ডেশনের যাত্রা শুরু। আমরা একটি বিশ্বাস আঁকড়ে ধরি: প্রতিবেশী যখন প্রতিবেশীর খোঁজ রাখে, কেউ পিছিয়ে থাকে না।",
    "intro.link": "আমাদের গল্প পড়ুন",
    "feed.title": "প্রতিটি বেলার খাবার, প্রতিটি বই, প্রতিটি চিকিৎসা।",
    "feed.body": "অনুদান সরাসরি উপরের কর্মসূচিতে যায়, আর প্রতিটি অনুদান গণনায় ধরার আগে আমাদের দল যাচাই করে নিশ্চিত করে।",
    "feed.cta": "অনুদান দিন",

    "programs.title": "আমাদের কাজ",
    "programs.sub": "আমরা শুরু করি মৌলিক মানবিক চাহিদা পূরণ দিয়ে, তারপর ভালো ভবিষ্যতের দরজা খুলে দিই।",
    "programs.all": "সব কর্মসূচি দেখুন",
    "common.readMore": "আরও পড়ুন",
    "common.readStory": "পড়ুন",
    "common.empty.programs": "কর্মসূচির তালিকা শীঘ্রই এখানে দেওয়া হবে।",
    "common.empty.stories": "এখনো কোনো খবর নেই। শীঘ্রই আবার দেখুন।",
    "common.empty.events": "এই মুহূর্তে কোনো আসন্ন আয়োজন নেই।",
    "common.loadError": "এই মুহূর্তে লোড করা যায়নি। পাতাটি রিফ্রেশ করুন।",
    "common.back": "সব খবরে ফিরে যান",
    "common.notFound": "এই লেখাটি খুঁজে পাওয়া যায়নি।",

    "impact.title": "এখন পর্যন্ত আমাদের অর্জন",
    "impact.people": "উপকারভোগী মানুষ",
    "impact.families": "সহায়তা পাওয়া পরিবার",
    "impact.volunteers": "স্বেচ্ছাসেবক",
    "impact.projects": "সম্পন্ন প্রকল্প",

    "stories.title": "সাম্প্রতিক খবর",
    "stories.all": "সব খবর",
    "events.title": "আসন্ন আয়োজন",

    "cta.title": "আরও একটি পরিবারের পাশে দাঁড়াতে আমাদের সাহায্য করুন।",
    "cta.donate": "অনুদান দিন",
    "cta.volunteer": "স্বেচ্ছাসেবক হোন",

    "footer.explore": "দেখুন",
    "footer.contact": "যোগাযোগ",
    "footer.rights": "© ২০২৬ আহতাব ফাউন্ডেশন। সর্বস্বত্ব সংরক্ষিত।",
    "footer.admin": "অ্যাডমিন",
    "footer.pending": "যোগাযোগের তথ্য শীঘ্রই যোগ করা হবে।",

    "about.title": "আমাদের কথা",
    "about.lede": "একটি নতুন প্রতিষ্ঠান, কিন্তু ধারণাটি পুরোনো: পাশের মানুষটির খোঁজ রাখা।",
    "about.story.title": "কেন আমরা শুরু করেছি",
    "about.story.p1": "আহতাব ফাউন্ডেশন ২০২৬ সালে বাংলাদেশের ফরিদপুরে প্রতিষ্ঠিত হয়েছে। আমাদের দাদার আদর্শ ও মানবিকতাকে সম্মান জানাতে এবং সেবার মধ্য দিয়ে সেই উত্তরাধিকার এগিয়ে নিতে এর পথচলা।",
    "about.story.p2": "আমরা বিশ্বাস করি ছোট সাহায্যও বড় প্রভাব ফেলতে পারে, আর যাদের সবচেয়ে কম আছে তাদের প্রতি যত্নের মধ্য দিয়েই একটি সমাজ শক্তিশালী হয়।",
    "about.mission.title": "আমাদের লক্ষ্য",
    "about.mission.body": "যাদের সবচেয়ে বেশি প্রয়োজন, তাদের দিকে সাহায্যের হাত বাড়িয়ে দেওয়া।",
    "about.approach.title": "আমরা যেভাবে কাজ করি",
    "about.approach.1": "প্রথমে মৌলিক চাহিদা পূরণ: খাদ্য, স্বাস্থ্য, পানি ও আশ্রয়।",
    "about.approach.2": "শিক্ষা ও সুযোগের মাধ্যমে ভালো ভবিষ্যতের দরজা খুলে দেওয়া।",
    "about.approach.3": "এমন একটি অন্তর্ভুক্তিমূলক সমাজ গড়া, যেখানে কেউ পিছিয়ে থাকে না।",
    "about.values.title": "আমরা যা বিশ্বাস করি",
    "about.v1.t": "সহমর্মিতা",
    "about.v1.d": "আমরা শুরু করি মন দিয়ে শোনা আর পাশে থাকা দিয়ে।",
    "about.v2.t": "মর্যাদা",
    "about.v2.d": "সাহায্য যেন কাউকে ছোট না করে।",
    "about.v3.t": "অন্তর্ভুক্তি",
    "about.v3.d": "প্রয়োজনে থাকা প্রত্যেকেই আমাদের কাছে সমান, তার পরিচয় যা-ই হোক।",
    "about.v4.t": "জবাবদিহিতা",
    "about.v4.d": "প্রতিটি অনুদান কীভাবে ব্যবহার হলো, আমরা তা জানাব।",
    "about.where.title": "আমরা যেখানে কাজ করি",
    "about.where.body": "আমরা ফরিদপুরভিত্তিক এবং শুরু করছি আমাদের আশপাশের জনপদ থেকে।",

    "stories.page.title": "খবর ও গল্প",
    "stories.page.lede": "আমাদের কাজের খবর, আমাদের নিজের ভাষায়।",
    "events.page.title": "আসন্ন আয়োজন",
    "cat.news": "খবর",
    "cat.update": "আপডেট",
    "cat.story": "গল্প",

    "involved.title": "পাশে দাঁড়ান",
    "involved.lede": "অর্থ দিন, সময় দিন, কিংবা আমাদের কথা অন্যকে জানান। তিনটিই কাজে লাগে।",
    "give.title": "অনুদান দিন",
    "give.none": "আমাদের অর্থপ্রদানের তথ্য প্রস্তুত করা হচ্ছে। যোগাযোগ করুন, আজই কীভাবে দেবেন আমরা জানাব।",
    "give.step": "অনুদান পাঠানোর পর এখানে আমাদের জানান, যাতে আমরা নিশ্চিত করে ধন্যবাদ জানাতে পারি।",
    "give.form.title": "আপনার অনুদানের তথ্য জানান",
    "give.note": "এই ফর্ম শুধু আপনার অনুদানের তথ্য জমা রাখে, টাকা পাঠায় না।",
    "give.submit": "আমার অনুদান জানান",
    "give.thanks": "ধন্যবাদ। আপনার তথ্য পেয়েছি, শীঘ্রই অনুদান নিশ্চিত করব।",
    "form.name": "আপনার নাম",
    "form.phone": "ফোন",
    "form.email": "ইমেইল",
    "form.optional": "(ঐচ্ছিক)",
    "form.amount": "পরিমাণ (টাকা)",
    "form.method": "পেমেন্ট মাধ্যম",
    "form.method.other": "অন্যান্য",
    "form.trx": "ট্রানজ্যাকশন আইডি",
    "form.message": "বার্তা",
    "form.subject": "বিষয়",
    "form.sending": "পাঠানো হচ্ছে…",
    "form.error": "পাঠানো যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন।",
    "vol.title": "স্বেচ্ছাসেবক হোন",
    "vol.lede": "কীভাবে সাহায্য করতে চান জানান, আমরা ফোন করব।",
    "vol.area": "কোথায় সাহায্য করতে পারবেন?",
    "vol.a.logistics": "বিতরণ ও সরবরাহ",
    "vol.a.health": "স্বাস্থ্য ও প্রাথমিক চিকিৎসা",
    "vol.a.teaching": "পাঠদান ও পরামর্শ",
    "vol.a.fund": "তহবিল সংগ্রহ",
    "vol.a.media": "ছবি, ভিডিও ও ডিজাইন",
    "vol.a.other": "অন্য কিছু",
    "vol.submit": "স্বেচ্ছাসেবক হতে চাই",
    "vol.thanks": "সময় দেওয়ার জন্য ধন্যবাদ। শীঘ্রই ফোন করব।",
    "spread.title": "অন্যকে জানান",
    "spread.body": "এই পাতাটি বন্ধু বা পরিবারের কাউকে পাঠান। যিনি আমাদের কথা শোনেন, তিনিই আরেকটি সাহায্যের হাত।",
    "share.copy": "লিংক কপি করুন",
    "share.copied": "লিংক কপি হয়েছে",

    "contact.title": "যোগাযোগ",
    "contact.lede": "প্রশ্ন, পরামর্শ, কিংবা এমন কোনো পরিবার যাদের কথা আমাদের জানা দরকার? আমাদের লিখুন।",
    "contact.form.title": "বার্তা পাঠান",
    "contact.submit": "বার্তা পাঠান",
    "contact.thanks": "ধন্যবাদ। আপনার বার্তা পেয়েছি, শীঘ্রই উত্তর দেব।",
    "contact.info": "আমাদের খুঁজে নিন",
    "contact.location": "ঠিকানা",
  },
};

// First visit: Bangla for people in Bangladesh, English for everyone else. Bangladesh is the only place on the
// Asia/Dhaka time zone, and the browser knows it without sending anything anywhere, so no IP address is looked up.
// Once someone picks a language with the toggle, that choice wins.
function defaultLang() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Asia/Dhaka" || tz === "Asia/Dacca") return "bn";
  } catch (_) { /* no Intl: fall through */ }
  return "en";
}

export function getLang() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === "en" || saved === "bn") return saved;
  } catch (_) { /* storage unavailable */ }
  return defaultLang();
}

export function setLang(lang) {
  try { localStorage.setItem(KEY, lang); } catch (_) { /* ignore */ }
  location.reload();
}

export function t(key) {
  return dict[getLang()][key] ?? dict.en[key] ?? key;
}

// Pick the Bangla field when the visitor reads Bangla and one exists, otherwise English.
export function pick(row, base) {
  if (!row) return "";
  if (getLang() === "bn" && row[`${base}_bn`]) return row[`${base}_bn`];
  return row[`${base}_en`] ?? row[base] ?? "";
}

export function setting(obj, base) {
  if (!obj) return "";
  if (getLang() === "bn" && obj[`${base}_bn`]) return obj[`${base}_bn`];
  return obj[`${base}_en`] ?? "";
}

export function applyI18n(root = document) {
  document.documentElement.lang = getLang();
  root.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
  root.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  const titleKey = document.body.dataset.title;
  if (titleKey) document.title = t(titleKey);
}

export function fmtDate(iso, opts = { day: "numeric", month: "long", year: "numeric" }) {
  try {
    return new Intl.DateTimeFormat(getLang() === "bn" ? "bn-BD" : "en-GB", opts).format(new Date(iso));
  } catch (_) { return ""; }
}

export function fmtNumber(n) {
  try {
    return new Intl.NumberFormat(getLang() === "bn" ? "bn-BD" : "en-GB").format(Number(n) || 0);
  } catch (_) { return String(n); }
}
