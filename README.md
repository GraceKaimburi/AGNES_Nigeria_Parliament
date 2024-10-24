# Nigeria_Parliament_AGNES
The Parliamentary Accountability and Support Tool promotes transparency and informed decision-making by providing parliamentarians with critical information. It enhances oversight, aligns parliamentary actions with national goals, and fosters public trust, driving positive change and upholding democratic values.


 Monitoring and Accountability Tool

 Project Overview

The Monitoring and Accountability Tool is designed to enhance transparency and accountability in government processes by allowing users to search through and analyze official government documents, specifically focusing on legislative texts from the Nigerian Parliament. This tool enables citizens, researchers, and policy analysts to easily access, search, and monitor key documents to ensure that governmental actions align with the principles of good governance and public interest.

This project integrates with Webflow UI to provide a seamless interface for end users, where they can enter queries and retrieve relevant sections from documents hosted on official government websites, such as the Nigerian Parliament site.

 Features

- Document Scraping: Fetches and downloads official government documents (e.g., PDFs) from publicly available websites like the Nigerian Parliament site.
- Keyword Search: Allows users to enter specific queries and search for keywords within the downloaded documents.
- User-Friendly Interface: Provides a Webflow-based UI where users can interact with the tool without needing technical expertise.
- Real-time Monitoring: Instantly processes user input and returns relevant sections from documents in a user-friendly manner.
- Accountability Focus: Designed to help monitor government actions, policies, and legislative changes for enhanced public accountability.

 How It Works

1. User Input: A user enters a keyword or query in the Webflow-based interface.
2. Document Scraping: The tool automatically fetches relevant documents from the Nigerian Parliament website.
3. PDF Parsing: The tool processes and parses the content of the PDF files, extracting text.
4. Search Functionality: It searches for the user’s keyword in the document and retrieves relevant matches.
5. Results Display: The user is provided with the results of the search directly in the Webflow UI.

 Installation

 Prerequisites

- Python 3.x
- Firebase CLI
- Webflow (for the frontend UI)
- Installed dependencies: `pdfplumber`, `requests`, and `firebase-functions`

 Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repository/monitoring-accountability-tool.git
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Initialize Firebase functions:
   ```bash
   firebase init functions
   ```

4. Deploy the function to Firebase:
   ```bash
   firebase deploy --only functions
   ```

5. Set up the Webflow frontend and integrate with the Firebase function's endpoint.

 Usage

1. Go to the Webflow interface and enter a search query.
2. Click on the search button to start scanning documents.
3. The tool will display whether the keyword is found in any of the documents and highlight relevant sections.

 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any features or bug fixes.

 License

Details will be Here.

