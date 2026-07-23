#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Malik Poultry Farm website — user reported that the contact form was showing 'Failed to fetch' error. Also improve features: Brand showcase, product search, WhatsApp inquiry, contact form fix."

backend:
  - task: "Contact form inquiry endpoint (/api/inquiries)"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "User reported 'Failed to fetch' on the contact form. Endpoint POST /api/inquiries validates name/phone/message, saves inquiry to MongoDB collection 'inquiries', returns {ok:true,id}. Also added: input trim, 15s abort timeout on the client side, better error messaging, success overlay UI. GET /api/health returns {ok:true} for smoke test. CORS headers set. Please verify: (1) GET /api/health returns 200 with ok:true; (2) POST /api/inquiries with valid {name, phone, message} returns 200 with ok:true and an id (UUID); (3) MongoDB collection 'inquiries' has the new document; (4) POST with missing required fields returns 400 with an error message; (5) OPTIONS preflight returns 204 with CORS headers; (6) Malformed JSON body is handled gracefully."
        -working: true
        -agent: "testing"
        -comment: "✅ ALL BACKEND TESTS PASSED (9/9). Comprehensive testing completed: (1) GET /api/health returns 200 with {ok:true, service:'malik-poultry-api', time:<ISO timestamp>} ✓ (2) POST /api/inquiries with valid payload returns 200 with {ok:true, id:<UUID>} ✓ (3) MongoDB persistence verified - document saved correctly with all fields (id, name, phone, message, createdAt) ✓ (4) Validation working: empty name returns 400 ✓, missing name returns 400 ✓, missing phone returns 400 ✓ (5) OPTIONS /api/inquiries returns 204 with CORS headers (Access-Control-Allow-Origin, Methods, Headers) ✓ (6) Malformed JSON handled gracefully - returns 400 with error message ✓ (7) Unknown route GET /api/nonexistent returns 404 ✓. The 'Failed to fetch' issue reported by user is RESOLVED. Backend API is fully functional."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 2
  run_ui: false

test_plan:
  current_focus:
    - "Contact form → WhatsApp redirect (frontend)"
    - "Smart search with dropdown suggestions"
    - "Language switcher EN/UR"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

frontend:
  - task: "Contact form → WhatsApp redirect (no more Failed to fetch)"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "REBUILT contact form. Removed the fetch('/api/inquiries') call entirely. On submit: validates name/phone/message → constructs a formatted message ('New Inquiry — Malik Poultry Farm\\n\\nName:\\n[name]\\n\\nPhone:\\n[phone]\\n\\nMessage:\\n[message]') → calls openWhatsApp() helper which does window.open('https://wa.me/923484113201?text=<encoded>', '_blank'). If popup blocked, falls back to window.location.href. Shows success toast 'Your inquiry has been sent successfully.' and green overlay 'Thank you!' modal. Please verify: (1) Filling all three fields and submitting a) shows success message b) opens a new tab/window to wa.me/923484113201 with correctly-encoded message body. (2) Empty submit shows validation errors. (3) Works in English AND Urdu (labels + error messages should be translated). Data-testids: contact-form, name-input, phone-input, message-input, submit-btn."

  - task: "Smart search with dropdown suggestions + highlight animation"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Search bar in navbar. As user types, dropdown ([data-testid=search-suggestions]) shows matching items from a 15-item index (5 poultry + 10 beverages). Each suggestion has [data-testid=suggestion-<key>] (e.g. suggestion-coca-cola, suggestion-fresh-chicken). Clicking a suggestion or pressing Enter should smoothly scroll to the target card (id='brand-<key>' for beverage brands, id='product-<key>' for poultry) and apply a red highlight-pulse animation for ~3.5s (class 'highlight-target'). Arrow keys navigate; Escape closes; clicking outside closes; clear (X) button empties query. If no match, shows [data-testid=no-search-results] with 'No products found.' Please verify: (a) typing 'cola' shows Coca-Cola suggestion; (b) clicking it scrolls to brand-coca-cola and the card gets red pulse ring animation; (c) typing 'chicken' shows all 3 chicken items; (d) clicking Fresh Chicken scrolls to product-fresh-chicken card with pulse; (e) typing 'xyz' shows 'No products found'; (f) Enter key selects first suggestion; (g) works on mobile (icon toggle)."

  - task: "Language switcher EN/UR with localStorage persistence and RTL"
    implemented: true
    working: "NA"
    file: "/app/app/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: true
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Two-state toggle in navbar: [data-testid=lang-en] and [data-testid=lang-ur]. Default English. Clicking UR: sets html dir='rtl' and lang='ur', loads Noto Nastaliq Urdu font, translates ALL user-facing text (nav, hero, about, brands, products, reviews, contact form labels + placeholders + error messages + success overlay + footer). Persists via localStorage key 'mpf_lang'. Reloading page should preserve the last selected language. Product/brand names translated in Urdu (e.g. Coca-Cola → کوکا کولا, Fresh Chicken → تازہ چکن). Search also works in both languages (index rebuilds per language). Please verify: (1) clicking UR instantly translates the whole page and layout is RTL; (2) clicking EN switches back; (3) after reload, previously-selected language is restored; (4) contact form validation errors appear in Urdu when in UR mode; (5) search suggestions show Urdu names when in UR mode."

metadata:
  created_by: "main_agent"
  version: "1.1"
  test_sequence: 3
  run_ui: true

agent_communication:
    -agent: "main"
    -message: "Frontend testing needed for 3 features: (1) Contact form now opens WhatsApp directly instead of calling the API (user reported 'Failed to fetch' — API is deprecated for this flow). (2) Smart search with dropdown suggestions and highlight-pulse scroll animation. (3) Language switcher (English ↔ Urdu) with full page translation, RTL layout, and localStorage persistence. Please test each thoroughly. The user specifically asked to verify the contact form now WORKS (i.e. opens WhatsApp with pre-filled message on submit, and no longer shows 'Failed to fetch'). NOTE: window.open to wa.me may open a new tab — in Playwright, listen for a new page/popup event OR check that page.evaluate('window.open = spy') captures the correct URL. Base URL for testing: https://poultry-beverages-pk.preview.emergentagent.com"
