/*
  # Add trigger for automatic profile creation
  
  1. Changes
    - Add function to handle new user registration
    - Add trigger to automatically create profile
    
  2. Security
    - No changes to existing RLS policies
    - Maintains existing security model
*/

-- Create a trigger function to create a profile on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();