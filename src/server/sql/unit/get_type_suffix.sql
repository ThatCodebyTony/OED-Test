/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

-- Returns units of type suffix that can be seen - normally all can be seen.

SELECT * FROM units WHERE type_of_unit = 'suffix'::unit_type and displayable != 'none'::displayable_type;
