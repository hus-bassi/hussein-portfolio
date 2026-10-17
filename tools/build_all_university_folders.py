# -*- coding: utf-8 -*-
"""
Script to create dedicated, fully-prepared application folders for all Russian universities
offering Bachelor's 38.03.05 Business Informatics, complete with tailored email text files
and attached PDF portfolios ready for immediate dragging into Gmail.
"""

import os
import shutil
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding="utf-8")

# Import the verified university dataset
sys.path.append("tools")
from build_universities_excel import UNIVERSITIES_DATA

BASE_DIR = os.path.join(r"d:\hussein-portfolio\مشروع", "جامعات_روسيا_للتقديم")
SRC_DIR = r"d:\hussein-portfolio\مشروع"

# Short recognizable names for folders and emails
SHORT_NAMES = {
    1: ("01_РУДН_Москва_RUDN", "РУДН", "جامعة الصداقة بين الشعوب (РУДН)"),
    2: ("02_ВШЭ_Москва_HSE", "НИУ ВШЭ", "المدرسة العليا للاقتصاد (ВШЭ موسكو)"),
    3: ("03_ВШЭ_СПб_HSE", "НИУ ВШЭ СПб", "المدرسة العليا للاقتصاد (ВШЭ سانت بطرسبرغ)"),
    4: ("04_Финуниверситет_Москва_FA", "Финансового университета", "جامعة التمويل التابعة للحكومة الروسية"),
    5: ("05_РЭУ_Плеханова_Москва_REA", "РЭУ им. Плеханова", "جامعة بليخانوف الروسية للاقتصاد"),
    6: ("06_МГТУ_Баумана_Москва_BMSTU", "МГТУ им. Баумана", "جامعة باومان التقنية بموسكو"),
    7: ("07_ИТМО_СПб_ITMO", "Университета ИТМО", "جامعة إيتمو الوطنية لتكنولوجيا المعلومات"),
    8: ("08_СПбГУ_СПб_SPbU", "СПбГУ", "جامعة سانت بطرسبرغ الحكومية"),
    9: ("09_СПбПУ_Политех_СПб_SPbSTU", "СПбПУ Петра Великого", "جامعة سانت بطرسبرغ متعددة التقنيات (البوليتكنيك)"),
    10: ("10_СПбГЭУ_СПб_UNECON", "СПбГЭУ", "جامعة سانت بطرسبرغ الحكومية للاقتصاد"),
    11: ("11_РАНХиГС_Москва_RANEPA", "РАНХиГС", "الأكاديمية الرئاسية الروسية (رانهيجس)"),
    12: ("12_МИФИ_Москва_MEPhI", "НИЯУ МИФИ", "الجامعة الوطنية للبحوث النووية (ميفي)"),
    13: ("13_МИСИС_Москва_MISIS", "Университета МИСИС", "الجامعة الوطنية للبحوث التكنولوجية (ميسيس)"),
    14: ("14_РТУ_МИРЭА_Москва_MIREA", "РТУ МИРЭА", "الجامعة التكنولوجية الروسية (ميريا)"),
    15: ("15_ГУУ_Москва_GUU", "ГУУ", "جامعة الإدارة الحكومية بموسكو"),
    16: ("16_МЭИ_Москва_MPEI", "НИУ МЭИ", "معهد موسكو لهندسة الطاقة (مئي)"),
    17: ("17_Московский_Политех_Mospolytech", "Московского Политеха", "جامعة البوليتكنيك بموسكو"),
    18: ("18_УрФУ_Екатеринбург_UrFU", "УрФУ", "جامعة الأورال الفيدرالية (يكاترينبورغ)"),
    19: ("19_КФУ_Казань_KFU", "КФУ", "جامعة قازان الفيدرالية"),
    20: ("20_ТГУ_Томск_TSU", "НИ ТГУ", "جامعة تومسك الحكومية للبحوث"),
    21: ("21_ННГУ_Лобачевского_Н_Новгород_UNN", "ННГУ им. Лобачевского", "جامعة لوباتشيفسكي بنيجني نوفغورود"),
    22: ("22_ЮФУ_Ростов_SFedU", "ЮФУ", "الجامعة الفيدرالية الجنوبية (روستوف على الدون)"),
    23: ("23_СФУ_Красноярск_SFU", "СФУ", "الجامعة الفيدرالية السيبيرية (كراسنويارسك)"),
    24: ("24_ДВФУ_Владивосток_FEFU", "ДВФУ", "جامعة الشرق الأقصى الفيدرالية (فلاديفوستوك)"),
    25: ("25_НГУ_Новосибирск_NSU", "НГУ", "جامعة نوفوسيبيرسك الحكومية للبحوث"),
    26: ("26_Самарский_университет_SSAU", "Самарского университета", "جامعة سمارة الوطنية للبحوث"),
    27: ("27_ЮУрГУ_Челябинск_SUSU", "ЮУрГУ", "جامعة جنوب الأورال الحكومية (تشيليابينسك)"),
    28: ("28_ВГУ_Воронеж_VSU", "ВГУ", "جامعة فورونيج الحكومية"),
    29: ("29_КубГУ_Краснодар_KubSU", "КубГУ", "جامعة كوبان الحكومية (كراسنودار)"),
    30: ("30_СКФУ_Ставрополь_NCFU", "СКФУ", "جامعة شمال القوقاز الفيدرالية (ستافروبول)"),
    31: ("31_ТИУ_Тюмень_TIU", "ТИУ", "جامعة تيومين الصناعية"),
    32: ("32_ПГНИУ_Пермь_PSU", "ПГНИУ", "جامعة بيرم الحكومية الوطنية للبحوث"),
}

def generate_folders():
    os.makedirs(BASE_DIR, exist_ok=True)

    cv_src = os.path.join(SRC_DIR, "CV_Hussein_ElBassiouni.pdf")
    certs_src = os.path.join(SRC_DIR, "Certificates_Hussein_ElBassiouni.pdf")
    project_universal_src = os.path.join(SRC_DIR, "Project_Souq_Elmajde_Medical.pdf")
    project_rudn_src = os.path.join(SRC_DIR, "Project_Souq_Elmajde_RUDN.pdf")

    assert os.path.exists(cv_src), f"Missing: {cv_src}"
    assert os.path.exists(certs_src), f"Missing: {certs_src}"
    assert os.path.exists(project_universal_src), f"Missing: {project_universal_src}"

    for u in UNIVERSITIES_DATA:
        num = u["num"]
        folder_name, short_ru, name_ar_clean = SHORT_NAMES.get(num, (f"{num:02d}_{u['city_ru']}", u["name_ru"], u["name_ru"]))
        folder_path = os.path.join(BASE_DIR, folder_name)
        os.makedirs(folder_path, exist_ok=True)

        # Copy CV and Certificates
        shutil.copy2(cv_src, os.path.join(folder_path, "CV_Hussein_ElBassiouni.pdf"))
        shutil.copy2(certs_src, os.path.join(folder_path, "Certificates_Hussein_ElBassiouni.pdf"))

        # For RUDN, keep its dedicated PDF; for all others use universal PDF
        if num == 1:
            shutil.copy2(project_rudn_src, os.path.join(folder_path, "Project_Souq_Elmajde_RUDN.pdf"))
            project_pdf_name = "Project_Souq_Elmajde_RUDN.pdf"
            priority_phrase = "и планирую указать РУДН приоритетом №1."
            support_letter_phrase = "Прошу рассмотреть возможность выдачи рекомендательного письма (письма поддержки) от РУДН для Россотрудничества."
            project_desc = "Презентация проекта для РУДН (Souq Elmajde)"
        else:
            shutil.copy2(project_universal_src, os.path.join(folder_path, "Project_Souq_Elmajde_Medical.pdf"))
            project_pdf_name = "Project_Souq_Elmajde_Medical.pdf"
            priority_phrase = f"и планирую включить {short_ru} в список своих приоритетных университетов."
            support_letter_phrase = f"Прошу рассмотреть мое портфолио и возможность выдачи рекомендательного письма (письма поддержки) от {short_ru} для Россотрудничества."
            project_desc = "Презентация ИТ-проекта (Souq Elmajde)"

        # Tailored email content
        to_email = u["email_primary"]
        subject_line = f"Письмо поддержки на квоту 2027/2028 (38.03.05 Бизнес-информатика) — {short_ru} — Хуссейн Эльбассиуни"

        body_text = f"""Здравствуйте!

Меня зовут Хуссейн Эльбассиуни (Hussein Mohamed Mostafa Ahmed ElBassiouni), гражданин Египта, загранпаспорт: A44712057.

Я готовлюсь к подаче на квоту Правительства РФ на 2027/2028 уч. год (старт 15 ноября) по направлению 38.03.05 «Бизнес-информатика» {priority_phrase}

{support_letter_phrase}

Во вложении:
1. Копия загранпаспорта
2. Резюме (CV)
3. Все сертификаты (DataCamp, NASBA, AI)
4. {project_desc}
• Портфолио: https://hus-bassi.vercel.app

С уважением,
Хуссейн Эльбассиуни
WhatsApp: +201022977790"""

        readme_content = f"""================================================================================
الجامعة: {name_ar_clean}
Университет: {u['name_ru']} ({u['name_en']})
المدينة: {u['city_ar']} ({u['city_ru']})
التخصص: {u['code']} Бизнес-информатика (Business Informatics)
================================================================================

1. بيانات الإرسال في جيميل:
--------------------------------------------------------------------------------
إلى (To):
{to_email}

الموضوع (Subject / Тема):
{subject_line}

--------------------------------------------------------------------------------
2. نص الرسالة بالروسي (انسخه كما هو وضعه في الإيميل):
--------------------------------------------------------------------------------
{body_text}

--------------------------------------------------------------------------------
3. الملفات المرفقة (موجودة وجاهزة داخل هذا المجلد):
--------------------------------------------------------------------------------
1. Passport_Hussein_ElBassiouni.pdf (صورة جواز سفرك)
2. CV_Hussein_ElBassiouni.pdf
3. Certificates_Hussein_ElBassiouni.pdf
4. {project_pdf_name}

--------------------------------------------------------------------------------
4. طريقة وميعاد الإرسال:
--------------------------------------------------------------------------------
• اتأكد إن علامة تتبع الإيميل Streak (العين البرتقالية 👁️) شغالة.
• اضغط على السهم بجانب زر الإرسال ▼ واختر جدولة الإرسال (Schedule Send).
• اختر يوم الإثنين القادم الساعة 9:30 صباحاً بتوقيت مصر/موسكو.
================================================================================
"""

        txt_file_path = os.path.join(folder_path, "بيانات_التقديم_والإيميل.txt")
        with open(txt_file_path, "w", encoding="utf-8") as f:
            f.write(readme_content)

    print(f"Successfully generated all {len(UNIVERSITIES_DATA)} university folders in {BASE_DIR}!")

if __name__ == "__main__":
    generate_folders()
