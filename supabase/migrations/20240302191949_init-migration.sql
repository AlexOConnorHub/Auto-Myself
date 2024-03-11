-- This is a supabase function that is called test, and take an argument "arg" which is an integar
-- It should return arg + 1, and the current timestamp
-- As this is a supabase function, it needs to be plgpgsql
-- The return type is JSON

CREATE OR REPLACE FUNCTION test(arg int) RETURNS JSON AS $$
BEGIN
  RETURN json_build_object('result', arg + 2, 'now', now());
END;
$$ LANGUAGE plpgsql;
