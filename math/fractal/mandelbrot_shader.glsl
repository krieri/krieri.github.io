precision mediump float;

varying vec2 v_pos;
uniform vec2 u_offset;
uniform float u_zoom;
uniform float u_maxIter;
uniform float u_threshold;

float hueToRgb( float m1, float m2, float hue ) {
    float v;
    if ( hue < 0.0 ) {
        hue += 1.0;
    }
    else if ( hue > 1.0 ) {
        hue -= 1.0;
    }
    if ( 6.0 * hue < 1.0 ) {
        v = m1 + ( m2 - m1 ) * hue * 6.0;
    }
    else if ( 2.0 * hue < 1.0 ) {
        v = m2;
    }
    else if ( 3.0 * hue < 2.0 ) {
        v = m1 + ( m2 - m1 ) * ( 2.0 / 3.0 - hue ) * 6.0;
    }
    else {
        v = m1;
    }
    return v;
}
vec3 hsl2rgb( float h, float s, float l ) {
    float m1, m2, hue;
    float r, g, b;
    if ( s == 0.0 ) {
        r = g = b = l;
    }
    else {
        if ( l <= 0.5 ) {
            m2 = l * ( s + 1.0 );
        }
        else {
            m2 = l + s - l * s;
        }
        m1 = l * 2.0 - m2;
        hue = h;
        r = hueToRgb( m1, m2, hue + 0.333 );
        g = hueToRgb( m1, m2, hue);
        b = hueToRgb( m1, m2, hue - 0.333 );
    }
    return vec3( r, g, b );
}
void main()
{
	float a = 2.0 * u_zoom * v_pos.x + u_offset.x;
	float b = 1.2 * u_zoom * v_pos.y + u_offset.y;
	vec2 z = vec2(0.0, 0.0);
	vec2 z_sq = vec2(0.0, 0.0);
	float v;
	for (int i = 0; i < 1000; i++)
	{
		z_sq = vec2(z.x * z.x, z.y * z.y);
		if (i >= int(u_maxIter))
		{
			v = (1.0 - log2(log(sqrt(z_sq.x + z_sq.y)))) / u_maxIter;
			break;
		}
		z.y = 2.0 * z.x * z.y + b;
		z.x = z_sq.x - z_sq.y + a;
		if (z_sq.x + z_sq.y > u_threshold)
		{
			v = (float(i) + 1.0 - log2(log(sqrt(z_sq.x + z_sq.y)))) / u_maxIter;
			break;
		}
	}
	vec3 clr = hsl2rgb( 1.0 - v, 0.6, v );
    gl_FragColor = vec4( clr, 1.0 );
}