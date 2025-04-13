# app/services/date_extractor.py
import re
from dateutil import parser

def extract_expiry_dates(text: str):
    patterns = [
        #r'(best\s+by[:\s]*)?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        #r'(exp(?:iry|ires)?[:\s]*)?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})',
        #r'(\d{4}[/-]\d{1,2}[/-]\d{1,2})',
        # Matches "EXP 06.10.2016" or "Best by 06-10-2016"
        r'(exp(?:iry|ires)?|best\s+by)?[:\s]*([0-9]{1,2}[./\-\s][0-9]{1,2}[./\-\s][0-9]{2,4})',
        # Matches ISO-style like "2016-10-06"
        r'([0-9]{4}[./\-\s][0-9]{1,2}[./\-\s][0-9]{1,2})',
    ]
    matches = []
    for pattern in patterns:
        for match in re.findall(pattern, text, re.IGNORECASE):
            # match can be a tuple like ('EXP', '06.10.2016')
            date_str = match[-1]  # always take the last group
            try:
                date = parser.parse(date_str, fuzzy=True, dayfirst=True)
                matches.append(date.strftime('%Y-%m-%d'))
            except Exception as e:
                continue
    return matches
