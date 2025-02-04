-- Drop existing social links policies
DROP POLICY IF EXISTS "Users can view any social links" ON social_links;
DROP POLICY IF EXISTS "Users can insert own social links" ON social_links;
DROP POLICY IF EXISTS "Users can update own social links" ON social_links;
DROP POLICY IF EXISTS "Users can delete own social links" ON social_links;

-- Create cleaner social links policies
CREATE POLICY "Enable read access for all users"
  ON social_links FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for users based on profile_id"
  ON social_links FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable update for users based on profile_id"
  ON social_links FOR UPDATE
  USING (auth.uid() = profile_id)
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Enable delete for users based on profile_id"
  ON social_links FOR DELETE
  USING (auth.uid() = profile_id);

-- Fix profile query issue by adding products to the profile select
CREATE OR REPLACE FUNCTION get_profile_with_relations(profile_id uuid)
RETURNS json AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'id', p.id,
      'display_name', p.display_name,
      'username', p.username,
      'bio', p.bio,
      'avatar_url', p.avatar_url,
      'headline', p.headline,
      'social_links', COALESCE(
        (SELECT json_agg(row_to_json(sl))
         FROM social_links sl
         WHERE sl.profile_id = p.id
         ORDER BY sl.order),
        '[]'::json
      ),
      'experiences', COALESCE(
        (SELECT json_agg(row_to_json(e))
         FROM experiences e
         WHERE e.profile_id = p.id
         ORDER BY e.order),
        '[]'::json
      ),
      'products', COALESCE(
        (SELECT json_agg(row_to_json(pr))
         FROM products pr
         WHERE pr.profile_id = p.id
         ORDER BY pr.order),
        '[]'::json
      )
    )
    FROM profiles p
    WHERE p.id = profile_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;