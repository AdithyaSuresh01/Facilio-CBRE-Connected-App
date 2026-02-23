export type ResourceType = "Article" | "Video" | "PDF";

export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url?: string;
  content?: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  articleCount: number;
  videoCount: number;
  pdfCount: number;
  resources: Resource[];
}

export const categories: Category[] = [
  {
    id: "1",
    slug: "general-navigation",
    title: "General Navigation",
    description:
      "Navigate the platform, manage user roles, and personalise your dashboard.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 1,
    resources: [
      { id: "r1", title: "Getting Started Guide", type: "Article", content: "Welcome to the platform! This guide walks you through the initial setup process, including logging in for the first time, setting up your profile, and customizing your workspace.\n\n## First Steps\n\nAfter receiving your login credentials, navigate to the platform URL and enter your email and password. You'll be prompted to set a new password on your first login.\n\n## Profile Setup\n\nClick on your avatar in the top-right corner to access Profile Settings. Here you can update your name, contact information, and notification preferences.\n\n## Workspace Customization\n\nThe dashboard is fully customizable. Drag and drop widgets to rearrange them, or click 'Add Widget' to include new data panels relevant to your role." },
      {
        id: "r2",
        title: "System Overview",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      {
        id: "r3",
        title: "User Roles & Permissions",
        type: "PDF",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
      { id: "r4", title: "FAQs", type: "Article", content: "## Frequently Asked Questions\n\n**Q: How do I reset my password?**\nA: Click 'Forgot Password' on the login page, or go to Profile Settings > Security > Change Password.\n\n**Q: Can I access the platform on mobile?**\nA: Yes, the platform is fully responsive and works on all modern mobile browsers. A dedicated mobile app is also available.\n\n**Q: How do I contact support?**\nA: Use the Help icon in the bottom-right corner to open a support ticket, or email support@facilio.com.\n\n**Q: How often is data synced?**\nA: Real-time data is synced every 15 seconds. Historical reports are updated hourly." },
      { id: "r5", title: "Dashboard Overview", type: "Article", content: "The Dashboard is your central hub for monitoring operations at a glance.\n\n## Key Widgets\n\n- **Work Order Summary**: Shows open, in-progress, and completed work orders for the current period.\n- **Energy Consumption**: Displays real-time energy usage compared to benchmarks.\n- **Alerts & Notifications**: Lists recent system alerts requiring attention.\n- **Occupancy Overview**: Shows current building occupancy rates.\n\n## Customization\n\nEach widget can be resized, moved, or removed. Use the 'Edit Dashboard' button to enter customization mode. Changes are saved automatically per user." },
    ],
  },
  {
    id: "2",
    slug: "portfolio-management",
    title: "Portfolio Management",
    description:
      "Organize properties into portfolios and track cross-site KPIs.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r6", title: "Portfolio Setup Guide", type: "Article", content: "Learn how to create and configure portfolios to organize your properties effectively.\n\n## Creating a Portfolio\n\nNavigate to Portfolio Management > New Portfolio. Enter the portfolio name, description, and select the properties to include.\n\n## Portfolio Settings\n\nEach portfolio can have custom KPIs, reporting schedules, and access permissions. Configure these in the Portfolio Settings panel.\n\n## Best Practices\n\nGroup properties by region, type, or business unit for the most effective management. Use tags to enable cross-portfolio filtering." },
      {
        id: "r7",
        title: "Managing Properties",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r8", title: "Portfolio Analytics", type: "Article", content: "Portfolio Analytics provides comprehensive insights across all properties in a portfolio.\n\n## Available Reports\n\n- **Performance Summary**: Aggregated KPIs across all properties.\n- **Cost Analysis**: Breakdown of operational costs by property and category.\n- **Trend Analysis**: Historical performance trends over configurable time periods.\n\n## Exporting Data\n\nAll analytics can be exported as CSV or PDF. Schedule automated reports to be delivered via email to stakeholders." },
      { id: "r9", title: "Custom Portfolios", type: "Article", content: "Custom Portfolios allow you to create dynamic groupings of properties based on specific criteria.\n\n## Dynamic Filters\n\nSet up filter rules based on property attributes such as location, size, type, or custom fields. Properties matching the criteria are automatically included.\n\n## Sharing\n\nCustom portfolios can be shared with team members or kept private. Shared portfolios maintain consistent views across all users with access." },
    ],
  },
  {
    id: "3",
    slug: "asset-management",
    title: "Asset Management",
    description:
      "Register and track facility assets from installation to maintenance.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r10", title: "Asset Registration", type: "Article", content: "Register and catalog all facility assets for effective lifecycle management.\n\n## Adding Assets\n\nGo to Asset Management > Add Asset. Fill in the asset details including name, category, location, manufacturer, model, and serial number.\n\n## Asset Categories\n\nAssets are organized into categories such as HVAC, Electrical, Plumbing, and Fire Safety. Custom categories can be created in Settings.\n\n## QR Codes\n\nEach registered asset automatically receives a unique QR code that can be printed and attached to the physical asset for quick scanning and lookup." },
      {
        id: "r11",
        title: "Asset Tracking Overview",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r12", title: "Maintenance Schedules", type: "Article", content: "Set up and manage maintenance schedules to keep assets in optimal condition.\n\n## Creating Schedules\n\nNavigate to an asset's detail page and click 'Add Maintenance Schedule'. Define the frequency (daily, weekly, monthly, or custom), assign a technician, and attach a checklist.\n\n## Notifications\n\nThe system automatically sends reminders to assigned technicians before scheduled maintenance is due. Overdue tasks are escalated to supervisors." },
      { id: "r13", title: "Asset Categories", type: "Article", content: "Organize assets into logical categories for streamlined management.\n\n## Default Categories\n\nThe system comes with predefined categories: HVAC, Electrical, Plumbing, Fire Safety, Elevators, and General Equipment.\n\n## Custom Categories\n\nCreate custom categories in Settings > Asset Management > Categories. Each category can have its own set of custom fields, maintenance templates, and depreciation rules." },
    ],
  },
  {
    id: "4",
    slug: "purchase-orders",
    title: "Purchase Orders",
    description:
      "Create and track purchase orders with approvals and vendor management.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r14", title: "Creating Purchase Orders", type: "Article", content: "Learn how to create, submit, and track purchase orders within the platform.\n\n## New Purchase Order\n\nGo to Procurement > New Purchase Order. Select the vendor, add line items with quantities and pricing, and submit for approval.\n\n## Line Items\n\nEach line item requires a description, quantity, unit price, and optional notes. You can link items to specific assets or work orders for traceability.\n\n## Approval Workflow\n\nPurchase orders follow a configurable approval workflow based on the total amount and department." },
      {
        id: "r15",
        title: "PO Workflow Tutorial",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r16", title: "Vendor Management", type: "Article", content: "Manage your vendor database and track vendor performance over time.\n\n## Adding Vendors\n\nGo to Procurement > Vendors > Add Vendor. Enter company details, contact information, service categories, and payment terms.\n\n## Performance Tracking\n\nTrack vendor performance metrics including response time, completion rate, and quality scores. Use this data to make informed procurement decisions." },
      { id: "r17", title: "Approval Process", type: "Article", content: "Understand and configure the purchase order approval workflow.\n\n## Approval Levels\n\nSet up multi-level approvals based on PO value thresholds. For example, orders under $500 may need only manager approval, while orders over $5,000 require director sign-off.\n\n## Notifications\n\nApprovers receive email and in-app notifications when a PO requires their review. They can approve, reject, or request modifications directly from the notification." },
    ],
  },
  {
    id: "5",
    slug: "service-orders",
    title: "Service Orders",
    description:
      "Manage service provider engagements and monitor SLA compliance.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r18", title: "Service Order Basics", type: "Article", content: "Service orders track external service provider engagements for your facilities.\n\n## Creating a Service Order\n\nNavigate to Service Orders > New. Select the service type, assign a vendor, define the scope of work, and set the expected completion date.\n\n## Status Tracking\n\nService orders progress through stages: Draft, Submitted, In Progress, Pending Review, and Completed. Each stage transition can trigger notifications to relevant stakeholders." },
      {
        id: "r19",
        title: "Service Workflow Demo",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r20", title: "SLA Management", type: "Article", content: "Define and monitor Service Level Agreements to ensure vendor compliance.\n\n## Setting Up SLAs\n\nGo to Settings > SLA Configuration. Define response time targets, resolution time targets, and escalation rules for different priority levels.\n\n## Monitoring\n\nThe SLA dashboard shows real-time compliance rates. Breached SLAs are highlighted in red and automatically trigger escalation notifications." },
      { id: "r21", title: "Service Reporting", type: "Article", content: "Generate detailed reports on service order performance and vendor effectiveness.\n\n## Report Types\n\n- **Completion Summary**: Overview of completed, pending, and overdue service orders.\n- **Vendor Scorecard**: Performance metrics per vendor including SLA compliance.\n- **Cost Analysis**: Breakdown of service costs by category, vendor, and property." },
    ],
  },
  {
    id: "6",
    slug: "incident-reporting",
    title: "Incident Reporting",
    description:
      "Report safety incidents and equipment failures with escalation protocols.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r22", title: "Reporting an Incident", type: "Article", content: "Report safety incidents, equipment failures, or hazards quickly and accurately.\n\n## Filing a Report\n\nGo to Incidents > Report New Incident. Select the incident type, severity level, location, and provide a detailed description. Attach photos or documents as evidence.\n\n## Immediate Actions\n\nHigh-severity incidents automatically trigger emergency protocols and notify designated safety personnel." },
      {
        id: "r23",
        title: "Incident Dashboard Tutorial",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r24", title: "Escalation Procedures", type: "Article", content: "Understand the incident escalation process and configure rules for your organization.\n\n## Escalation Tiers\n\n- **Tier 1**: Supervisor notification (0-30 minutes)\n- **Tier 2**: Manager notification (30-60 minutes)\n- **Tier 3**: Director notification (60+ minutes)\n\n## Custom Rules\n\nConfigure custom escalation rules in Settings > Incidents > Escalation. Rules can be based on incident type, severity, location, or time elapsed." },
      { id: "r25", title: "Incident Templates", type: "Article", content: "Use templates to standardize incident reporting across your organization.\n\n## Default Templates\n\nThe system includes templates for common incident types: Safety Hazard, Equipment Failure, Environmental, and Security.\n\n## Custom Templates\n\nCreate custom templates with specific fields, required attachments, and pre-assigned responders. Templates ensure consistent and complete reporting." },
    ],
  },
  {
    id: "7",
    slug: "energy-management",
    title: "Energy Management",
    description:
      "Monitor real-time energy consumption, usage patterns, and benchmarks.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r26", title: "Energy Dashboard Setup", type: "Article", content: "Configure your energy monitoring dashboard to track consumption in real time.\n\n## Connecting Meters\n\nNavigate to Energy > Meter Configuration. Add your energy meters by entering meter details and communication protocols. The system supports BACnet, Modbus, and IoT sensors.\n\n## Dashboard Widgets\n\nAdd widgets for real-time consumption, daily/weekly/monthly trends, peak demand tracking, and cost projections." },
      {
        id: "r27",
        title: "Monitoring Overview",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r28", title: "Usage Reports", type: "Article", content: "Generate energy usage reports to identify consumption patterns and savings opportunities.\n\n## Report Options\n\n- **Consumption by Zone**: Energy usage broken down by building zones.\n- **Time-of-Use Analysis**: Consumption patterns across different time periods.\n- **Cost Allocation**: Energy costs allocated to departments or tenants.\n\n## Scheduling\n\nReports can be scheduled for automatic generation and email delivery." },
      { id: "r29", title: "Energy Benchmarking", type: "Article", content: "Compare your building's energy performance against industry standards and similar properties.\n\n## Benchmarking Metrics\n\nThe system calculates Energy Use Intensity (EUI), cost per square foot, and carbon emissions per occupant.\n\n## Peer Comparison\n\nCompare your properties against similar buildings in the platform's anonymized benchmarking database to identify improvement opportunities." },
    ],
  },
  {
    id: "8",
    slug: "visitor-management",
    title: "Visitor Management",
    description:
      "Manage visitor registration, check-in workflows, and access badges.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r30", title: "Visitor Registration", type: "Article", content: "Set up and manage the visitor registration process for your facilities.\n\n## Pre-Registration\n\nHosts can pre-register visitors through the platform. Pre-registered visitors receive an email with a QR code for expedited check-in.\n\n## Walk-In Registration\n\nWalk-in visitors can register at lobby kiosks or reception desks. The system captures visitor details, purpose of visit, and host information." },
      {
        id: "r31",
        title: "Check-in Flow Demo",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r32", title: "Visitor Reports", type: "Article", content: "Track and analyze visitor traffic across your facilities.\n\n## Available Reports\n\n- **Daily Traffic**: Number of visitors per day with peak hours highlighted.\n- **Frequent Visitors**: List of recurring visitors with visit history.\n- **Host Activity**: Visitor counts grouped by host.\n\n## Compliance\n\nVisitor logs are maintained for compliance and audit purposes with configurable retention periods." },
      { id: "r33", title: "Access Control Setup", type: "Article", content: "Configure visitor access control to manage building security.\n\n## Access Zones\n\nDefine access zones within your building. Each zone can have different access levels (public, restricted, secure).\n\n## Temporary Badges\n\nThe system can generate temporary access badges with zone restrictions and time-based validity. Badges are automatically deactivated when the visit ends." },
    ],
  },
  {
    id: "9",
    slug: "space-management",
    title: "Space Management",
    description:
      "Book shared spaces, monitor occupancy, and manage floor plans.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r34", title: "Space Booking Guide", type: "Article", content: "Learn how to book meeting rooms, desks, and other shared spaces.\n\n## Booking a Space\n\nNavigate to Space Management > Book Space. Select the space type, date, time, and duration. Check real-time availability before confirming.\n\n## Recurring Bookings\n\nSet up recurring bookings for regular meetings. The system checks for conflicts and suggests alternative slots when needed.\n\n## Amenities\n\nFilter spaces by available amenities such as projector, whiteboard, video conferencing, or catering access." },
      {
        id: "r35",
        title: "Space Planning Tutorial",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r36", title: "Occupancy Tracking", type: "Article", content: "Monitor real-time and historical occupancy data across your facilities.\n\n## Sensors\n\nThe platform integrates with occupancy sensors (PIR, camera-based, badge readers) to provide real-time data.\n\n## Analytics\n\n- **Utilization Rate**: Percentage of time a space is occupied vs. available.\n- **Peak Hours**: Identify busiest times to optimize space allocation.\n- **Trend Analysis**: Track occupancy trends over weeks and months." },
      { id: "r37", title: "Floor Plan Setup", type: "Article", content: "Upload and configure interactive floor plans for your buildings.\n\n## Uploading Plans\n\nGo to Space Management > Floor Plans > Upload. Supported formats include DWG, PDF, and image files. The system auto-scales plans based on provided dimensions.\n\n## Interactive Mapping\n\nMap spaces, assets, and sensors onto the floor plan for visual management. Click on any mapped item to view details or create a work order." },
    ],
  },
  {
    id: "10",
    slug: "work-order-management",
    title: "Work Order Management",
    description:
      "Create, assign, and track work orders with priority-based SLAs.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r38", title: "Creating Work Orders", type: "Article", content: "Create and manage work orders to track maintenance and repair tasks.\n\n## New Work Order\n\nGo to Work Orders > New. Fill in the details: title, description, priority, category, location, and assigned technician.\n\n## Attachments\n\nAttach photos, documents, or voice notes to provide additional context. Attachments are visible to all assigned team members.\n\n## Priority Levels\n\nWork orders can be set to Low, Medium, High, or Emergency priority. Priority affects SLA timelines and notification urgency." },
      {
        id: "r39",
        title: "Work Order Lifecycle",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r40", title: "Assignment & Tracking", type: "Article", content: "Assign work orders to technicians and track progress in real time.\n\n## Assignment\n\nWork orders can be assigned manually or auto-assigned based on technician availability, skills, and workload.\n\n## Tracking\n\nTrack work order status through stages: Open, Assigned, In Progress, On Hold, and Completed. Technicians can update status and add notes from the mobile app." },
      { id: "r41", title: "Completion Reports", type: "Article", content: "Generate reports on work order completion rates, response times, and team performance.\n\n## Key Metrics\n\n- **Average Response Time**: Time from creation to first action.\n- **Average Resolution Time**: Time from creation to completion.\n- **First-Time Fix Rate**: Percentage of work orders resolved on first visit.\n- **Backlog Trend**: Number of open work orders over time." },
    ],
  },
  {
    id: "11",
    slug: "preventive-maintenance",
    title: "Preventive Maintenance",
    description:
      "Schedule recurring maintenance based on time, meters, or sensors.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r42", title: "PM Schedule Setup", type: "Article", content: "Configure preventive maintenance schedules to minimize equipment downtime.\n\n## Creating a Schedule\n\nGo to PM > New Schedule. Select the asset(s), define the frequency (time-based or meter-based), assign a technician or team, and attach a maintenance checklist.\n\n## Triggers\n\nSchedules can be triggered by calendar intervals (e.g., every 30 days), meter readings (e.g., every 1,000 hours), or condition-based thresholds from IoT sensors." },
      {
        id: "r43",
        title: "PM Overview Tutorial",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r44", title: "Checklist Templates", type: "Article", content: "Create and manage maintenance checklist templates for consistent task execution.\n\n## Building a Checklist\n\nGo to PM > Checklist Templates > New. Add checklist items with descriptions, expected values, and pass/fail criteria.\n\n## Item Types\n\nSupported item types include: Yes/No, Numeric Reading, Text Input, Photo Capture, and Dropdown Selection. Each type validates technician input accordingly." },
      { id: "r45", title: "Compliance Reports", type: "Article", content: "Track preventive maintenance compliance to ensure regulatory adherence.\n\n## Compliance Dashboard\n\nThe PM Compliance dashboard shows overall compliance rate, overdue tasks, and upcoming schedules.\n\n## Audit Trail\n\nEvery PM task maintains a complete audit trail including completion timestamps, technician notes, checklist responses, and attached documentation. This data is essential for regulatory audits." },
    ],
  },
  {
    id: "12",
    slug: "reports-analytics",
    title: "Reports & Analytics",
    description:
      "Build custom reports, automate delivery, and export data.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r46", title: "Custom Report Builder", type: "Article", content: "Build custom reports tailored to your organization's specific needs.\n\n## Report Builder\n\nGo to Reports > Custom Report > New. Select the data source (Work Orders, Assets, Energy, etc.), choose fields to include, apply filters, and select the visualization type.\n\n## Visualizations\n\nAvailable chart types: Bar, Line, Pie, Table, Heatmap, and Stacked Bar. Each visualization is interactive and supports drill-down." },
      {
        id: "r47",
        title: "Analytics Dashboard Demo",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r48", title: "Scheduled Reports", type: "Article", content: "Set up automated report generation and delivery on a recurring schedule.\n\n## Scheduling\n\nAfter creating a report, click 'Schedule'. Choose the frequency (daily, weekly, monthly), delivery time, and recipients.\n\n## Delivery Options\n\nReports can be delivered via email (PDF or Excel attachment), saved to a shared folder, or posted to a dashboard for team access." },
      { id: "r49", title: "Data Export Guide", type: "Article", content: "Export data from any module for external analysis or record-keeping.\n\n## Export Formats\n\nSupported formats include CSV, Excel (XLSX), PDF, and JSON. Each module's list view has an 'Export' button in the toolbar.\n\n## Bulk Export\n\nFor large datasets, use the Bulk Export feature in Settings > Data Management. Schedule exports for off-peak hours to minimize system impact.\n\n## API Access\n\nFor programmatic access, use the platform's REST API with your API key. Documentation is available in the Developer Portal." },
    ],
  },
  {
    id: "13",
    slug: "tenant-communication",
    title: "Tenant Communication",
    description:
      "Send announcements, manage requests, and streamline tenant interactions.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r50", title: "Announcements & Notices", type: "Article", content: "Broadcast announcements to tenants across your properties.\n\n## Creating an Announcement\n\nGo to Communications > New Announcement. Enter the subject, message body, and select the target audience — all tenants, specific buildings, or individual floors.\n\n## Delivery Channels\n\nAnnouncements can be delivered via in-app notification, email, or SMS. Schedule announcements for a future date or publish immediately.\n\n## Templates\n\nUse pre-built templates for common notices such as maintenance windows, emergency alerts, and policy updates." },
      {
        id: "r51",
        title: "Tenant Portal Walkthrough",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r52", title: "Request Management", type: "Article", content: "Handle tenant service requests efficiently from submission to resolution.\n\n## Receiving Requests\n\nTenants submit requests through the tenant portal or mobile app. Each request is categorized automatically and routed to the appropriate team.\n\n## Tracking & Updates\n\nTenants can track request status in real time. Automated status updates are sent at each stage so tenants stay informed without needing to follow up." },
      { id: "r53", title: "Feedback & Surveys", type: "Article", content: "Collect tenant feedback to improve service quality.\n\n## Post-Service Surveys\n\nAutomatic satisfaction surveys are sent after each service request is resolved. Results are aggregated into a Tenant Satisfaction dashboard.\n\n## Custom Surveys\n\nCreate custom surveys for specific topics like facility improvements, amenity preferences, or event planning. Distribute via email or the tenant portal." },
    ],
  },
  {
    id: "14",
    slug: "compliance-safety",
    title: "Compliance & Safety",
    description:
      "Track regulatory compliance, safety inspections, and audit readiness.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r54", title: "Compliance Tracking", type: "Article", content: "Stay on top of regulatory requirements and compliance deadlines.\n\n## Compliance Calendar\n\nThe Compliance Calendar displays all upcoming inspections, certifications, and regulatory deadlines. Items are color-coded by urgency.\n\n## Document Management\n\nStore compliance documents — permits, certificates, inspection reports — in a centralized repository linked to the relevant property or asset.\n\n## Alerts\n\nAutomatic reminders are sent 30, 14, and 7 days before compliance deadlines to ensure nothing is missed." },
      {
        id: "r55",
        title: "Safety Inspection Demo",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r56", title: "Safety Inspections", type: "Article", content: "Schedule and conduct safety inspections with digital checklists.\n\n## Inspection Templates\n\nUse built-in templates for fire safety, OSHA compliance, electrical safety, and general building inspections. Customize templates to match local regulations.\n\n## Mobile Inspections\n\nInspectors can complete checklists on mobile devices, capture photos of issues, and flag items for immediate follow-up — all offline-capable." },
      { id: "r57", title: "Audit Preparation", type: "Article", content: "Prepare for audits with organized records and automated report generation.\n\n## Audit Packages\n\nGenerate comprehensive audit packages that bundle all relevant compliance documents, inspection records, maintenance logs, and certifications for a specific property or time period.\n\n## Gap Analysis\n\nThe system identifies compliance gaps by comparing your current records against regulatory requirements, highlighting missing or expired items that need attention before an audit." },
    ],
  },
  {
    id: "15",
    slug: "integrations-api",
    title: "Integrations & API",
    description:
      "Connect third-party tools, configure webhooks, and use the REST API.",
    articleCount: 3,
    videoCount: 1,
    pdfCount: 0,
    resources: [
      { id: "r58", title: "Integration Overview", type: "Article", content: "Connect Facilio with your existing tools and systems for a unified workflow.\n\n## Available Integrations\n\nThe platform supports native integrations with popular tools including Slack, Microsoft Teams, ServiceNow, SAP, and Google Workspace.\n\n## Setting Up\n\nGo to Settings > Integrations > Add Integration. Select the service, authenticate with your credentials, and configure the data sync options.\n\n## Data Sync\n\nChoose between real-time sync, scheduled sync, or manual sync depending on your requirements and the integration type." },
      {
        id: "r59",
        title: "API Quickstart",
        type: "Video",
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
      },
      { id: "r60", title: "Webhook Configuration", type: "Article", content: "Set up webhooks to receive real-time notifications when events occur in the platform.\n\n## Creating a Webhook\n\nNavigate to Settings > Integrations > Webhooks > New. Provide the endpoint URL, select the events to subscribe to, and optionally add authentication headers.\n\n## Supported Events\n\nWebhooks can be triggered by work order updates, asset status changes, alarm activations, visitor check-ins, and more. Each event payload includes full context data." },
      { id: "r61", title: "REST API Guide", type: "Article", content: "Use the Facilio REST API for programmatic access to platform data.\n\n## Authentication\n\nAll API requests require an API key passed in the Authorization header. Generate keys in Settings > API > API Keys.\n\n## Endpoints\n\nThe API provides endpoints for all major modules: Work Orders, Assets, Energy, Spaces, and Users. Full documentation with request/response examples is available in the Developer Portal.\n\n## Rate Limits\n\nAPI requests are rate-limited to 1,000 requests per minute per key. Contact support for higher limits if needed." },
    ],
  },
];