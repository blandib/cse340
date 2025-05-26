-- Task 1: Insert a new record into the account table
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Modify Tony Stark’s account type
UPDATE public.account
SET account_type = 'Client'  -- Use the correct enum value
WHERE account_email = 'tony@starkent.com';

-- Task 3: Delete Tony Stark’s record
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

-- Task 4: Modify the GM Hummer description
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_model = 'Hummer';

-- Task 5: Use an INNER JOIN to retrieve inventory data
SELECT inventory.inv_make, inventory.inv_model, classification.classification_name
FROM public.inventory
INNER JOIN public.classification 
ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';


-- Task 6: Update file paths for images
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
