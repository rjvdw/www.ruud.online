---
layout: ../../layouts/Math.astro
title: Derivation of the quadratic equation
---

# Derivation of the quadratic equation

The simplest quadratic equation is: $$x^2$$

Translation in the y-direction gives: $$x^2 + C$$

Translation in the x-direction gives: $$\left(x - B\right)^2 + C$$

Finally, scaling gives: $$A\left(x - B\right)^2 + C$$

Solving this equation for $$0$$ gives:

$$
\begin{align*}
A\left(x - B\right)^2 + C &= 0 \\
 \left(x - B\right)^2     &= \frac{-C}{A} \\
       x                  &= B \pm \sqrt{\frac{-C}{A}}
\end{align*}
$$

The &ldquo;default&rdquo; form of the quadratic equation is
$$ax^2 + bx +c$$, so let's rewrite to this form:

$$
A\left(x - B\right)^2 + C = Ax^2 - 2ABx + AB^2 + C
$$

From this, we can deduce:

$$
\begin{align*}
a = A        &\implies A = a \\
b = -2AB     &\implies B = \frac{-b}{2a} \\
c = AB^2 + C &\implies C = -\frac{b^2}{4a} + c
\end{align*}
$$

Combine these equations to get:

$$
\begin{align*}
x &= B \pm \sqrt{\frac{-C}{A}} \\
  &= \frac{-b}{2a} \pm \sqrt{\frac{b^2}{4a^2} - \frac{c}{a}} \\
  &= \frac{-b}{2a} \pm \sqrt{\frac{b^2}{4a^2} - \frac{4ac}{4a^2}} \\
  &= \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\end{align*}
$$
