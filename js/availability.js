/* =====================================================================
   MAPS HOLDINGS - ROOM AVAILABILITY
   =====================================================================
   HOW TO UPDATE AVAILABILITY (no coding knowledge needed):

   1. Open this file in Notepad (right-click -> Open with -> Notepad).
   2. Find the room type below and change the number after "available:".
      - 0 means fully booked.
      - 1 or more means that many rooms are open.
   3. Save the file (Ctrl+S).
   4. Refresh the website in your browser. Done!

   Do not change anything else in this file (the words in quotes and
   the punctuation like { } , : must stay exactly as they are).
   ===================================================================== */

const roomAvailability = {
  standard1300:     { available: 1 },   // R1,300 - Standard Rooms
  missingMiddle1600: { available: 0 },  // R1,600 - Missing Middle Rooms
  dropInOcean1750:   { available: 0 },  // R1,750 - A Drop In The Ocean
  bachelor2000:      { available: 0 }   // R2,000 - Bachelor Rooms
};
