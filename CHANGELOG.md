## Changelog

### 4.0.3

-   Fixed touch screen scrolling (for good)

### 4.0.2

-   Better error logs
-   Safer logging in
-   Fixed: status being cancelled
-   Less failures on files deletion
-   Showing progress on image deletion

### 4.0.1

-   Bug fix: Clicking staff member from home page should goes to members appointments
-   Bug fix: If todays has two backups, you should be able to delete the second
-   Bug fix: Critical bug with backups being needlessly encrypted
-   Enhancement: Safer restoring, not deleting data unless everything is ready
-   Enhancement: Loading bar at startup
-   Enhancement: Loading bar at restoring
-   Enhancement: better console logging, with updated PouchDB

### 4.0.1

-   Bug fix: Fixed an issue with offline mode
-   Bug fix: Fixed and issue with decrypting localstorage data
-   Bug fix: Mobx failed invariant issue
-   Bug fix: Appointments list panel gets hidden once the delete button is clicked
-   Bug fix: Fixed labworks and few other permission issues
-   Enhancement: document transformations on community version
-   Enhancement: less IDs length for less storage space
-   Enhancement: removing default values from documents before storing into DB

### 4.0.0

-   New feature: Supported version
-   New feature: hotlinking inside modules and panels is now supported
-   New feature: Statistics now showing a list of the appointments included
-   New feature: New module Labworks to manage and track cases sent to laboratories
-   New feature: Book appointments from the calendar module
-   New feature: Improved calendar to show more information about the appointments
-   New feature: virtual file system for offline version
-   New feature: compressed data inside indexeddb
-   Enhancement: Almost all information viewed are clickable and hotlinked to the relative panels
-   Enhancement: Showing more information at the table views
-   Enhancement: Better user panel
-   Enhancement: Better network & login status at the top right
-   Enhancement: Redesigned dashboard at the home page
-   Enhancement: Overall improved looks and feels
-   Enhancement: Improved dashboard
-   Enhancement: Improved user experience by using tabs and context menus
-   Enhancement: Can use gallery photos as avatars.
-   Enhancement: Added loading indicators for actions defined in settings menu.
-   Enhancement: Unified looks and feels across all modules and panels.
-   Enhancement: Better MobX & PouchDB integration, the old one was buggy and slow, now using PouchX.
-   Enhancement: Better encryption alogorthim (SJCL).
-   Enhancement: Database files are smaller & encrypted.
-   Enhancement: More simplified and enhanced backup & restore functionality
-   Bug fix: Fixed faulty first sync
-   Bug fix: Fixed when creating appointments it doesn't open
-   Bug fix: Fixed messy scrolling
-   Bug fix: Fixed scrolling to top when selecting an item in a module
-   Bug fix: Fixed slow module registration
-   Bug fix: dental chart is not updating
-   Bug fix: fixed an issue in messages where it becomes behind content
-   And many many more...

> P.S. This version was such a huge update that I actually lost track of all the bugs and enhancements that was done

### 3.2.1

-   Lock scrolling when a panel is opened
-   Fixed the buggy editable list
-   Redesigned time picker to 3 dropdowns for better UX
-   Resync a module when it's opened

### 3.2.0

-   New feature: Variable weekend
-   Enhancement: Statistics command bar
-   Enhancement: User panel
-   Bug fix: Show hourly rate only when time tracking is enabled
-   Bug fix: Better calculation of next appointment

### 3.1.0

-   New feature: Selecting a date format from setting #67
-   New feature: Confirmation on deleting a visit from the orthodontic records #66
-   New feature: Adding number of days between visits in the orthodontic records #64
-   New feature: Flipping images when cropping #63
-   Enhancement: Save higher resolution files when cropping
-   Enhancement: Added a tooltip to all icon button #63

### 3.0.2

-   Fixed: Time not showing while selecting #61
-   Fixed: Cephalometric window height #62
-   Fixed: Orthograph visit callout acting weird
-   Fixed: Automated backups requiring users to already have created directories

### 3.0.1

-   Fixed sorting textual values #59
-   Fixed editable list #60

### 3.0.0

-   New feature: Introduced internationalization
-   New feature: Orthodontic archive / replacing orthograph
-   New feature: calculation of outstanding and overpaid amounts
-   New feature: All files are uploaded to DropBox
-   New feature: client-side data encryption
-   Bug fix: Backup and restore was not being done as it should be
-   Bug fix: Automated backups was not being done as it should be
-   Bug fix: uploading images were requiring credentials
-   Bug fix: PIN, user permissions, and logging-out
-   Bug fix: offline mode had data persisting
-   Enhancement: Unified all date formats
-   Enhancement: Data tables and panels separation
-   Enhancement: A table of all the involved appointments in stats
-   Enhancement: Unification of icon sub-sets
-   Updated dependencies
-   Many more enhancements, bug fixes and new features

### 2.2.3

-   Fixed bug: creating new appointment while there are no registered treatments crashes the application
-   Fixed bug: triggering updates when changing operating staff

### 2.2.2

-   Show only upcoming appointments on staff page, as showing all appointments may not scale well.
-   Fixed: patient label suggestions were being repeated.

### 2.2.1

-   Sorting calendar appointments according to time

### 2.2.0

-   Deleting cephalometric analysis is now possible
-   Unifying height now works on opening the calender module
-   New Feature: Setting appointments exact time

### 2.1.2

-   Fixed non latin album names passed to Apexo

### 2.1.1

-   Fixed remote DB credentials

### 2.1.0

-   New feature: compaction on local and remote databases
-   New feature: compaction automation
-   Orthograph is now using the dropbox for storage
-   better UX on choosing duty days
-   better UX on choosing operating doctors

### 2.0.0

-   New feature: backup automation to Dropbox
-   New feature: users can be assistants or other staff members
-   New feature: user level and permission
-   New feature: user login PIN
-   New feature: Embedded Apps: Orthograph, Cephalometric
-   New feature: optional info taking

### 1.7.1

-   You can enter either birth year or age

### 1.7.0

-   Remove appointment date filters
-   limit data table rows
-   backing up and restoring using files
-   fixed issues in backing up and restoring

### 1.6.5

-   Graceful errors

### 1.6.4

-   Fixed: open appointments editor when creating the first appointment
-   Appointment notes instead of diagnosis and complaint
-   Ortho: Appliances & Modifications
-   Save login data more persistently

### 1.6.3

-   open item after creating
-   sort treatments alphabetically

### 1.6.2

-   Critical bug fixes

### 1.6.1

-   Performance improvements
-   improved searching capabilities
-   Fixed bug: calendar day height unification
-   Fixed bug: sorting by numerical columns

### 1.6.0

-   Consistent and responsive experience across all small screens
-   Consistent experience across modules
-   Consistent data manipulation experience
-   Fixed bug: labeled appointments in safari
-   Fixed bug: profit percentage calculation
-   New feature: Expenses per unit
-   New feature: hide/show doctor contact details
-   New feature: prescriptions units per time

### 1.5.5

-   Consistencies with panel headings
-   Solved few responsiveness issues
-   Random dates for appointments on demo
-   Fixed minor bugs

### 1.5.4

-   Fixed few bugs

### 1.5.2

-   Minor improvements concerning responsiveness

### 1.5.1

-   removed ant.design dependency

### 1.5.0

-   scroll to day when selecting it on the appointments page
-   moved inline styles to their respective SCSS file when applicable
-   fixed issue where tomorrow's appointments won't be viewed if it's the last day of the month
-   replaced NVD3 with chart.js for better bundle size and performance
-   loading demo data using restore functionality
-   fixed an issue where authentication occurring multiple times.

### 1.4.2

-   updated pouchdb-browser to latest release (7.0.0) and thus fixed the iOS idb issue

### 1.4.1

-   added missing icons

### 1.4.0

-   multiple demo hosts
-   fixed safari date issues (statistics & calendar modules)
-   added backup / restore feature
