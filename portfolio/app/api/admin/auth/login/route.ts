import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // TODO: replace with bcrypt.compare() in production
    if (password !== 'admin123') {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    return NextResponse.json({ success: true, user: { id: data.id, username: data.username } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
